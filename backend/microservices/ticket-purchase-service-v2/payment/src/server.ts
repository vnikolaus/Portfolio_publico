import "dotenv/config";
import express from "express";
import { orderPendingSubscriber, queue } from "./infra/container";

const port = Number(process.env.PORT ?? 3001);
export const app = express();

app.use(express.json());

app.get("/health", (_request, response) => {
    response.status(200).json({ status: "ok" });
});

async function startServer(): Promise<void> {
    await queue.connect();
    await orderPendingSubscriber.listen();

    app.listen(port, () => {
        console.log(`Payment service running on port ${port}`);
    });
}

if (require.main === module) {
    void startServer();
}
