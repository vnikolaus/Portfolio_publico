import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { simpleGit } from "simple-git";
import { parseGitHubRepositoryUrl } from "../utils/github.js";

export type CloneRepositoryInput = {
    url: string;
};

export type CloneRepositoryResult = {
    repositoryUrl: string;
    cloneUrl: string;
    owner: string;
    repo: string;
    projectPath: string;
    temporary: boolean;
};

export class RepositoryService {
    async cloneRepository(input: CloneRepositoryInput): Promise<CloneRepositoryResult> {
        const repository = parseGitHubRepositoryUrl(input.url);
        const tempRoot = path.join(os.tmpdir(), "mcp-server-repo-context-");
        const projectPath = await fs.mkdtemp(tempRoot);

        try {
            await simpleGit().clone(repository.cloneUrl, projectPath, ["--depth", "1"]);
            await fs.rm(path.join(projectPath, ".git"), {recursive: true, force: true});
        } catch (error) {
            await fs.rm(projectPath, {recursive: true, force: true});

            const message = error instanceof Error ? error.message : "Unknown git error";
            throw new Error(`Git clone failed: ${message}`);
        }

        return {
            repositoryUrl: repository.normalizedUrl,
            cloneUrl: repository.cloneUrl,
            owner: repository.owner,
            repo: repository.repo,
            projectPath,
            temporary: true,
        };
    }
}
