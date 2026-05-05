import type { Request, Response } from "express";

export class BuyTicketController {
    async handle(_request: Request, response: Response): Promise<void> {
        response.status(201).json({
            message: "Ticket purchase endpoint",
        });
    }
}
