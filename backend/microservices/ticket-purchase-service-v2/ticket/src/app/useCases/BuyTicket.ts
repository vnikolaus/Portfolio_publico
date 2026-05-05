import { Ticket } from "../../domain/entities/Ticket";
import type { TicketRepository } from "../repositories/TicketRepository";

type Input = {
    eventId: string;
    email: string;
    creditCardToken: string;
};

type Output = {
    ticketId: string;
};

export class BuyTicket {
    constructor(private readonly ticketRepository: TicketRepository) {}

    async execute(input: Input): Promise<Output> {
        const ticket = Ticket.create({
            eventId: input.eventId,
            email: input.email,
        });

        await this.ticketRepository.create(ticket);

        return {
            ticketId: ticket.ticketId,
        };
    }
}
