import type { MCPServer } from "mcp-use/server";
import { error as mcpError, object } from "mcp-use/server";
import * as z from "zod/v4";
import { RepositoryService } from "../services/RepositoryService.js";

const repositoryService = new RepositoryService();

export function registerRepositoryTools(server: MCPServer): void {
    server.tool(
        {
            name: "clone_repository",
            title: "Clone Repository",
            description: "Clones a public GitHub repository into a temporary local directory.",
            schema: z.object({
                url: z.string().url().describe("Public HTTPS GitHub repository URL."),
            }),
        },
        async ({ url }) => {
            try {
                const result = await repositoryService.cloneRepository({url});
                return object(result);
            } catch (error) {
                const message = error instanceof Error ? error.message : "Unknown error";
                return mcpError(`Could not clone repository: ${message}`);
            }
        },
    );
}
