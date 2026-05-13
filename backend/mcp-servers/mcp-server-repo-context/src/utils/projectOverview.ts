export type PackageJsonData = {
    name?: string;
    main?: string;
    scripts?: Record<string, string>;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
};

export type PackageOverview = {
    name: string | null;
    packageManager: "npm" | "pnpm" | "yarn" | "bun" | "unknown";
    scripts: string[];
    dependencies: string[];
    devDependencies: string[];
};

export function detectPackageManager(rootFiles: string[]): PackageOverview["packageManager"] {
    if (rootFiles.includes("pnpm-lock.yaml")) {
        return "pnpm";
    }

    if (rootFiles.includes("yarn.lock")) {
        return "yarn";
    }

    if (rootFiles.includes("bun.lockb") || rootFiles.includes("bun.lock")) {
        return "bun";
    }

    if (rootFiles.includes("package-lock.json")) {
        return "npm";
    }

    return "unknown";
}

export function createPackageOverview(packageJson: PackageJsonData | null, rootFiles: string[]): PackageOverview | null {
    if (!packageJson) {
        return null;
    }

    return {
        name: packageJson.name ?? null,
        packageManager: detectPackageManager(rootFiles),
        scripts: Object.keys(packageJson.scripts ?? {}).sort(),
        dependencies: Object.keys(packageJson.dependencies ?? {}).sort(),
        devDependencies: Object.keys(packageJson.devDependencies ?? {}).sort(),
    };
}

export function findTestFiles(filePaths: string[]): string[] {
    return filePaths.filter((filePath) => {
        const normalizedPath = filePath.replaceAll("\\", "/");
        return (
            normalizedPath.includes("/__tests__/") ||
            normalizedPath.startsWith("__tests__/") ||
            normalizedPath.startsWith("tests/") ||
            normalizedPath.startsWith("test/") ||
            /\.(test|spec)\.[cm]?[jt]sx?$/.test(normalizedPath)
        );
    }).sort();
}

export function findEntrypointCandidates(filePaths: string[], packageJson: PackageJsonData | null): string[] {
    const candidates = new Set<string>();
    const filePathSet = new Set(filePaths);

    if (packageJson?.main) {
        candidates.add(packageJson.main);
    }

    for (const script of Object.values(packageJson?.scripts ?? {})) {
        for (const entrypoint of extractEntrypointsFromScript(script)) {
            candidates.add(entrypoint);
        }
    }

    for (const commonPath of getCommonEntrypointPaths()) {
        if (filePathSet.has(commonPath)) {
            candidates.add(commonPath);
        }
    }

    return [...candidates].sort();
}

function extractEntrypointsFromScript(script: string): string[] {
    const entrypoints: string[] = [];
    const entryOptionMatch = script.match(/--entry\s+([^\s]+)/);

    if (entryOptionMatch?.[1]) {
        entrypoints.push(entryOptionMatch[1]);
    }

    for (const token of script.split(/\s+/)) {
        if (/^[\w./-]+\.[cm]?[jt]s$/.test(token)) {
            entrypoints.push(token);
        }
    }

    return entrypoints;
}

function getCommonEntrypointPaths(): string[] {
    return [
        "index.ts",
        "index.js",
        "main.ts",
        "main.js",
        "app.ts",
        "app.js",
        "server.ts",
        "server.js",
        "src/index.ts",
        "src/index.js",
        "src/main.ts",
        "src/main.js",
        "src/app.ts",
        "src/app.js",
        "src/server.ts",
        "src/server.js",
        "src/server/index.ts",
        "src/server/index.js",
    ];
}
