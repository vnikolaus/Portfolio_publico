import type { Express } from "express";

import { BuyTicketController } from "../controllers/BuyTicketController";

const buyTicketController = new BuyTicketController();

export function registerTicketRoutes(app: Express): void {
    app.post("/buy", (request, response) => {
        void buyTicketController.handle(request, response);
    });
}
