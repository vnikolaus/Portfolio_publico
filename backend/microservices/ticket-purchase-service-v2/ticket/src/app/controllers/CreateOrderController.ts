import type { Request, Response } from "express";
import { z } from "zod";
import type { BuyTicket } from "../useCases/BuyTicket";

const createOrderSchema = z.object({
    eventId: z.uuid(),
    email: z.email(),
    creditCardToken: z.string().min(1),
    quantity: z.number().int().positive(),
});

export class CreateOrderController {
    constructor(private readonly buyTicket: BuyTicket) {}

    async handle(request: Request, response: Response): Promise<void> {
        const parsedInput = createOrderSchema.safeParse(request.body);

        if (!parsedInput.success) {
            response.status(400).json({
                message: "Invalid request body",
                issues: parsedInput.error.issues,
            });
            return;
        }

        const input = parsedInput.data;
        const output = await this.buyTicket.execute(input);

        response.status(201).json(output);
    }
}
