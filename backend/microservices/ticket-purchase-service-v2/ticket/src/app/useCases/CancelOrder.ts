import type { OrderRepository } from "../repositories/OrderRepository";
import type { TicketRepository } from "../repositories/TicketRepository";

type Input = {
    orderId: string;
    ticketIds: string[];
};

export class CancelOrder {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly ticketRepository: TicketRepository,
    ) {}

    async execute(input: Input): Promise<void> {
        const order = await this.orderRepository.findById(input.orderId);

        if (!order) {
            throw new Error("Order not found");
        }

        order.cancel();

        await this.ticketRepository.updateStatusByIds(input.ticketIds, "cancelled");
        await this.orderRepository.update(order);

        console.log("[ORDER CANCELLED]", order);
    }
}
