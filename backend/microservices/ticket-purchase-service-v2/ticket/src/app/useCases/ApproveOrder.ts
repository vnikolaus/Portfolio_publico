import type { OrderRepository } from "../repositories/OrderRepository";
import type { TicketRepository } from "../repositories/TicketRepository";

type Input = {
    orderId: string;
    ticketIds: string[];
};

export class ApproveOrder {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly ticketRepository: TicketRepository,
    ) {}

    async execute(input: Input): Promise<void> {
        const order = await this.orderRepository.findById(input.orderId);

        if (!order) {
            throw new Error("Order not found");
        }

        order.pay();

        await this.ticketRepository.updateStatusByIds(input.ticketIds, "approved");
        await this.orderRepository.update(order);
        console.log("order: ", order);
    }
}
