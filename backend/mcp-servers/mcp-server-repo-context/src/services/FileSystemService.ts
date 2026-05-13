import fastGlob from "fast-glob";
import { promises as fs } from "node:fs";
import path from "node:path";
import {
    createPackageOverview,
    findEntrypointCandidates,
    findTestFiles,
    type PackageJsonData,
    type PackageOverview,
} from "../utils/projectOverview.js";

const MAX_FILE_SIZE_BYTES = 1024 * 1024;
const MAX_SEARCH_RESULTS = 100;
const IGNORED_DIRECTORIES = ["node_modules", ".git", "dist", "build"];
const BINARY_FILE_EXTENSIONS = new Set([
    ".7z",
    ".avi",
    ".bmp",
    ".class",
    ".dll",
    ".doc",
    ".docx",
    ".exe",
    ".gif",
    ".ico",
    ".jar",
    ".jpeg",
    ".jpg",
    ".mov",
    ".mp3",
    ".mp4",
    ".o",
    ".pdf",
    ".png",
    ".so",
    ".webp",
    ".xls",
    ".xlsx",
    ".zip",
]);

export type ReadFileInput = {
    projectPath: string;
    filePath: string;
};

export type ReadFileResult = {
    projectPath: string;
    filePath: string;
    absolutePath: string;
    sizeBytes: number;
    content: string;
};

export type ListFilesInput = {
    projectPath: string;
};

export type ProjectFileEntry = {
    path: string;
    type: "file" | "directory";
};

export type SearchTextInput = {
    projectPath: string;
    query: string;
    caseSensitive?: boolean;
};

export type SearchTextMatch = {
    filePath: string;
    line: number;
    column: number;
    preview: string;
};

export type ProjectOverviewInput = {
    projectPath: string;
};

export type ProjectOverview = {
    rootFiles: string[];
    topLevelFolders: string[];
    sourceFolders: string[];
    package: PackageOverview | null;
    entrypointCandidates: string[];
    testFiles: string[];
};

export class FileSystemService {
    async listFiles(input: ListFilesInput): Promise<ProjectFileEntry[]> {
        const projectRoot = await this.resolveProjectRoot(input.projectPath);
        const entries = await fastGlob("**/*", {
            cwd: projectRoot,
            dot: true,
            onlyFiles: false,
            unique: true,
            ignore: this.getIgnoredGlobPatterns(),
        });

        const fileEntries = await Promise.all(
            entries.sort().map(async (entry): Promise<ProjectFileEntry> => {
                const absolutePath = await this.resolveSafePath(projectRoot, entry);
                const entryStat = await fs.stat(absolutePath);

                return {
                    path: entry,
                    type: entryStat.isDirectory() ? "directory" : "file",
                };
            }),
        );

        return fileEntries;
    }

    async searchText(input: SearchTextInput): Promise<SearchTextMatch[]> {
        const query = input.query.trim();

        if (query.length === 0) {
            throw new Error("Search query cannot be empty.");
        }

        const projectRoot = await this.resolveProjectRoot(input.projectPath);
        const filePaths = await fastGlob("**/*", {
            cwd: projectRoot,
            dot: true,
            onlyFiles: true,
            unique: true,
            ignore: this.getIgnoredGlobPatterns(),
        });

        const matches: SearchTextMatch[] = [];
        const normalizedQuery = input.caseSensitive ? query : query.toLowerCase();

        for (const filePath of filePaths.sort()) {
            if (matches.length >= MAX_SEARCH_RESULTS) {
                break;
            }

            const absolutePath = await this.resolveSafePath(projectRoot, filePath);
            const fileStat = await fs.stat(absolutePath);

            if (!fileStat.isFile() || fileStat.size > MAX_FILE_SIZE_BYTES) {
                continue;
            }

            if (await this.isBinaryFile(absolutePath)) {
                continue;
            }

            const content = await fs.readFile(absolutePath, "utf8");
            const lines = content.split(/\r?\n/);

            for (const [lineIndex, lineContent] of lines.entries()) {
                const normalizedLine = input.caseSensitive ? lineContent : lineContent.toLowerCase();
                const columnIndex = normalizedLine.indexOf(normalizedQuery);

                if (columnIndex === -1) {
                    continue;
                }

                matches.push({
                    filePath,
                    line: lineIndex + 1,
                    column: columnIndex + 1,
                    preview: lineContent.trim(),
                });

                if (matches.length >= MAX_SEARCH_RESULTS) {
                    break;
                }
            }
        }

        return matches;
    }

    async getProjectOverview(input: ProjectOverviewInput): Promise<ProjectOverview> {
        const projectRoot = await this.resolveProjectRoot(input.projectPath);
        const entries = await fastGlob("**/*", {
            cwd: projectRoot,
            dot: true,
            onlyFiles: false,
            unique: true,
            ignore: this.getIgnoredGlobPatterns(),
        });

        const sortedEntries = entries.sort();
        const filePaths: string[] = [];
        const directoryPaths: string[] = [];

        for (const entry of sortedEntries) {
            const absolutePath = await this.resolveSafePath(projectRoot, entry);
            const entryStat = await fs.stat(absolutePath);

            if (entryStat.isDirectory()) {
                directoryPaths.push(entry);
            } else if (entryStat.isFile()) {
                filePaths.push(entry);
            }
        }

        const rootFiles = filePaths.filter((filePath) => !filePath.includes("/")).sort();
        const topLevelFolders = directoryPaths.filter((directoryPath) => !directoryPath.includes("/")).sort();
        const sourceFolders = directoryPaths
            .filter((directoryPath) => directoryPath.startsWith("src/") && !directoryPath.slice(4).includes("/"))
            .map((directoryPath) => directoryPath.slice(4))
            .sort();
        const packageJson = await this.readPackageJson(projectRoot);

        return {
            rootFiles,
            topLevelFolders,
            sourceFolders,
            package: createPackageOverview(packageJson, rootFiles),
            entrypointCandidates: findEntrypointCandidates(filePaths, packageJson),
            testFiles: findTestFiles(filePaths),
        };
    }

    async readFile(input: ReadFileInput): Promise<ReadFileResult> {
        const projectRoot = await this.resolveProjectRoot(input.projectPath);
        const absolutePath = await this.resolveSafePath(projectRoot, input.filePath);
        const fileStat = await fs.stat(absolutePath);

        if (!fileStat.isFile()) {
            throw new Error(`Path is not a file: ${input.filePath}`);
        }

        if (fileStat.size > MAX_FILE_SIZE_BYTES) {
            throw new Error(
                `File is too large: ${fileStat.size} bytes. Max allowed size is ${MAX_FILE_SIZE_BYTES} bytes.`,
            );
        }

        if (await this.isBinaryFile(absolutePath)) {
            throw new Error(`File appears to be binary and cannot be read as text: ${input.filePath}`);
        }

        const content = await fs.readFile(absolutePath, "utf8");

        return {
            projectPath: projectRoot,
            filePath: input.filePath,
            absolutePath,
            sizeBytes: fileStat.size,
            content,
        };
    }

    private async resolveProjectRoot(projectPath: string): Promise<string> {
        const resolvedProjectPath = path.resolve(projectPath);
        const projectStat = await fs.stat(resolvedProjectPath);

        if (!projectStat.isDirectory()) {
            throw new Error(`Project path is not a directory: ${projectPath}`);
        }

        return fs.realpath(resolvedProjectPath);
    }

    private async readPackageJson(projectRoot: string): Promise<PackageJsonData | null> {
        const packageJsonPath = path.join(projectRoot, "package.json");

        try {
            const content = await fs.readFile(packageJsonPath, "utf8");
            return JSON.parse(content) as PackageJsonData;
        } catch {
            return null;
        }
    }

    private async resolveSafePath(projectRoot: string, filePath: string): Promise<string> {
        const resolvedPath = path.resolve(projectRoot, filePath);

        if (!this.isInsidePath(projectRoot, resolvedPath)) {
            throw new Error(`File path escapes project root: ${filePath}`);
        }

        const realPath = await fs.realpath(resolvedPath);

        if (!this.isInsidePath(projectRoot, realPath)) {
            throw new Error(`File path resolves outside project root: ${filePath}`);
        }

        return realPath;
    }

    private isInsidePath(parentPath: string, childPath: string): boolean {
        const relativePath = path.relative(parentPath, childPath);

        return (relativePath === "" || (!relativePath.startsWith("..") && !path.isAbsolute(relativePath)));
    }

    private getIgnoredGlobPatterns(): string[] {
        return IGNORED_DIRECTORIES.flatMap((directory) => [
            directory,
            `${directory}/**`,
            `**/${directory}`,
            `**/${directory}/**`,
        ]);
    }

    private async isBinaryFile(filePath: string): Promise<boolean> {
        if (BINARY_FILE_EXTENSIONS.has(path.extname(filePath).toLowerCase())) {
            return true;
        }

        const fileHandle = await fs.open(filePath, "r");

        try {
            const sampleBuffer = Buffer.alloc(512);
            const {bytesRead} = await fileHandle.read(sampleBuffer, 0, sampleBuffer.length, 0);

            return sampleBuffer.subarray(0, bytesRead).includes(0);
        } finally {
            await fileHandle.close();
        }
    }
}
