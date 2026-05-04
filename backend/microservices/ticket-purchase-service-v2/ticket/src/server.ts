import "dotenv/config";

import express from "express";

const port = Number(process.env.PORT ?? 3000);
export const app = express();

app.use(express.json());

app.get("/health", (_request, response) => {
    response.status(200).json({ status: "ok" });
});

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Ticket service running on port ${port}`);
    });
}
