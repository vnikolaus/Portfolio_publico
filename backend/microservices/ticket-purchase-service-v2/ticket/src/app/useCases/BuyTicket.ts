import { Ticket } from "../../domain/entities/Ticket";
import type { Queue } from "../../infra/queue/Queue";
import type { EventRepository } from "../repositories/EventRepository";
import type { TicketRepository } from "../repositories/TicketRepository";

type Input = {
    eventId: string;
    email: string;
    creditCardToken: string;
};

type Output = {
    ticketId: string;
};

type TicketReservedPayload = {
    ticketId: string;
    eventId: string;
    email: string;
    creditCardToken: string;
    priceInCents: number;
};

export class BuyTicket {
    constructor(
        private readonly eventRepository: EventRepository,
        private readonly ticketRepository: TicketRepository,
        private readonly queue: Queue,
    ) {}

    async execute(input: Input): Promise<Output> {
        const event = await this.eventRepository.findById(input.eventId);

        if (!event) {
            throw new Error("Event not found");
        }

        const ticket = Ticket.create({
            eventId: input.eventId,
            email: input.email,
        });

        await this.ticketRepository.create(ticket);

        const payload: TicketReservedPayload = {
            ticketId: ticket.ticketId,
            eventId: ticket.eventId,
            email: ticket.email,
            creditCardToken: input.creditCardToken,
            priceInCents: event.priceInCents,
        };

        await this.queue.publish("ticketReserved", payload);

        return {
            ticketId: ticket.ticketId,
        };
    }
}
