import "dotenv/config";
import express from "express";
import { queue, ticketReservedSubscriber } from "./infra/container";

const port = Number(process.env.PORT ?? 3001);
export const app = express();

app.use(express.json());

app.get("/health", (_request, response) => {
    response.status(200).json({ status: "ok" });
});

(async () => {
    if (require.main === module) {
        await queue.connect();
        await ticketReservedSubscriber.listen();

        app.listen(port, () => {
            console.log(`Payment service running on port ${port}`);
        });
    }
})();
