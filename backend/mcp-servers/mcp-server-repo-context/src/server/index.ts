import { MCPServer } from "mcp-use/server";
import { registerFileTools } from "../tools/fileTools.js";
import { registerRepositoryTools } from "../tools/repositoryTools.js";

const server = new MCPServer({
    name: "mcp-server-repo-context",
    title: "MCP Server Repo Context",
    version: "0.1.0",
    description: "Servidor MCP simples para documentacao inteligente de projetos de software.",
    baseUrl: process.env.MCP_URL || "http://localhost:3000",
    favicon: "icon.svg",
    websiteUrl: "https://mcp-use.com",
    icons: [
        {
            src: "icon.svg",
            mimeType: "image/svg+xml",
            sizes: ["512x512"],
        },
    ],
});

registerFileTools(server);
registerRepositoryTools(server);

const PORT = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000;

console.log(`mcp-server-repo-context running on port ${PORT}`);

server.listen(PORT);
