import { Order } from "../../domain/entities/Order";
import { Ticket } from "../../domain/entities/Ticket";
import type { Queue } from "../../infra/queue/Queue";
import type { EventRepository } from "../repositories/EventRepository";
import type { OrderRepository } from "../repositories/OrderRepository";
import type { TicketRepository } from "../repositories/TicketRepository";

type Input = {
    eventId: string;
    email: string;
    creditCardToken: string;
    quantity: number;
};

type Output = {
    orderId: string;
    ticketIds: string[];
};

type OrderPendingPayload = {
    orderId: string;
    eventId: string;
    email: string;
    creditCardToken: string;
    quantity: number;
    totalPriceInCents: number;
    ticketIds: string[];
};

export class CreateOrder {
    constructor(
        private readonly eventRepository: EventRepository,
        private readonly orderRepository: OrderRepository,
        private readonly ticketRepository: TicketRepository,
        private readonly queue: Queue,
    ) {}

    async execute(input: Input): Promise<Output> {
        const event = await this.eventRepository.findById(input.eventId);

        if (!event) {
            throw new Error("Event not found");
        }

        const unavailableTickets =
            await this.ticketRepository.countByEventIdAndStatuses(input.eventId, [
                "reserved",
                "approved",
            ]);

        const availableTickets = event.capacity - unavailableTickets;

        if (input.quantity > availableTickets) {
            throw new Error("Not enough tickets available");
        }

        const order = Order.create({
            eventId: input.eventId,
            email: input.email,
            quantity: input.quantity,
            totalPriceInCents: event.priceInCents * input.quantity,
        });

        await this.orderRepository.create(order);

        const tickets = Array.from({ length: input.quantity }, () =>
            Ticket.create({
                orderId: order.orderId,
                eventId: input.eventId,
                email: input.email,
            }),
        );

        await this.ticketRepository.createMany(tickets);

        const ticketIds = tickets.map((ticket) => ticket.ticketId);

        const payload: OrderPendingPayload = {
            orderId: order.orderId,
            eventId: order.eventId,
            email: order.email,
            creditCardToken: input.creditCardToken,
            quantity: order.quantity,
            totalPriceInCents: order.totalPriceInCents,
            ticketIds,
        };

        await this.queue.publish("orderPending", payload);

        return {
            orderId: order.orderId,
            ticketIds,
        };
    }
}
