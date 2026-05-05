import type { Express } from "express";

import { buyTicketController } from "../../infra/container";


export function registerTicketRoutes(app: Express): void {
    app.post("/buy", (request, response) =>
        buyTicketController.handle(request, response),
    );
}
