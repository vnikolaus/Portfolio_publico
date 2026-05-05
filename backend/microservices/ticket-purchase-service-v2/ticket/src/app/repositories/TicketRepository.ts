import type { Ticket } from "../../domain/entities/Ticket";

export interface TicketRepository {
    create(ticket: Ticket): Promise<Ticket>;
    findById(ticketId: string): Promise<Ticket | null>;
    update(ticket: Ticket): Promise<Ticket | null>;
    delete(ticketId: string): Promise<void>;
}
