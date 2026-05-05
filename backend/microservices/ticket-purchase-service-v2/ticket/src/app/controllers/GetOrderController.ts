import type { Request, Response } from "express";
import type { OrderRepository } from "../repositories/OrderRepository";

export class GetOrderController {
    constructor(private readonly orderRepository: OrderRepository) {}

    async handle(request: Request, response: Response): Promise<void> {
        const orderId = String(request.params.orderId ?? "");

        if (!orderId) {
            response.status(400).json({ message: "Order id is required" });
            return;
        }

        const order = await this.orderRepository.findById(orderId);

        if (!order) {
            response.status(404).json({ message: "Order not found" });
            return;
        }

        response.status(200).json({
            orderId: order.orderId,
            eventId: order.eventId,
            email: order.email,
            quantity: order.quantity,
            totalPriceInCents: order.totalPriceInCents,
            status: order.status,
            createdAt: order.createdAt,
        });
    }
}
