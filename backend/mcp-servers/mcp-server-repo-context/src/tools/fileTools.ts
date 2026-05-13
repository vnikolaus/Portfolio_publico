import type { MCPServer } from "mcp-use/server";
import { array, error as mcpError, text } from "mcp-use/server";
import * as z from "zod/v4";
import { FileSystemService } from "../services/FileSystemService.js";

const fileSystemService = new FileSystemService();

export function registerFileTools(server: MCPServer): void {
    server.tool(
        {
            name: "list_files",
            title: "List Files",
            description: "Lists files and directories inside a project directory, ignoring common generated folders.",
            schema: z.object({
                projectPath: z.string().min(1).describe("Absolute or relative project directory path."),
            }),
        },
        async ({ projectPath }) => {
            try {
                const entries = await fileSystemService.listFiles({projectPath});
                return array(entries);
            } catch (error) {
                const message = error instanceof Error ? error.message : "Unknown error";
                return mcpError(`Could not list files: ${message}`);
            }
        },
    );

    server.tool(
        {
            name: "read_file",
            title: "Read File",
            description: "Reads a text file inside a project directory.",
            schema: z.object({
                projectPath: z.string().min(1).describe("Absolute or relative project directory path."),
                filePath: z.string().min(1).describe("File path relative to the project directory."),
            }),
        },
        async ({ projectPath, filePath }) => {
            try {
                const result = await fileSystemService.readFile({projectPath, filePath});
                return text(result.content);
            } catch (error) {
                const message = error instanceof Error ? error.message : "Unknown error";
                return mcpError(`Could not read file: ${message}`);
            }
        },
    );

    server.tool(
        {
            name: "search_text",
            title: "Search Text",
            description: "Searches text inside project files, ignoring common generated folders.",
            schema: z.object({
                projectPath: z.string().min(1).describe("Absolute or relative project directory path."),
                query: z.string().min(1).describe("Text to search for."),
                caseSensitive: z.boolean().optional().describe("Whether the search should be case-sensitive."),
            }),
        },
        async ({ projectPath, query, caseSensitive }) => {
            try {
                const matches = await fileSystemService.searchText({projectPath, query, caseSensitive});
                return array(matches);
            } catch (error) {
                const message = error instanceof Error ? error.message : "Unknown error";
                return mcpError(`Could not search text: ${message}`);
            }
        },
    );

    server.tool(
        {
            name: "project_overview",
            title: "Project Overview",
            description: "Returns a compact structured overview of a project for LLM context.",
            schema: z.object({
                projectPath: z.string().min(1).describe("Absolute or relative project directory path."),
            }),
        },
        async ({ projectPath }) => {
            try {
                const overview = await fileSystemService.getProjectOverview({projectPath});
                return array([overview]);
            } catch (error) {
                const message = error instanceof Error ? error.message : "Unknown error";
                return mcpError(`Could not get project overview: ${message}`);
            }
        },
    );
}
