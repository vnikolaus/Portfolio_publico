import { Router } from "express";
import { buyTicketController } from "../../infra/container";

export const ticketRoutes = Router();

ticketRoutes.post("/buy", (request, response) =>
    buyTicketController.handle(request, response),
);
