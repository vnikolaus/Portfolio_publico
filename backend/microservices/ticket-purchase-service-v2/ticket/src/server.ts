import "dotenv/config";

import express from "express";

import { registerTicketRoutes } from "./app/routes/ticket.routes";
import { queue } from "./infra/container";

const port = Number(process.env.PORT ?? 3000);
export const app = express();

app.use(express.json());

app.get("/health", (_request, response) => {
    response.status(200).json({ status: "ok" });
});

registerTicketRoutes(app);

async function startServer(): Promise<void> {
    await queue.connect();

    app.listen(port, () => {
        console.log(`Ticket service running on port ${port}`);
    });
}

if (require.main === module) {
    void startServer();
}
