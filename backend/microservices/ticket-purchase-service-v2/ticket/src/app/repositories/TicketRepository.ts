import type { Ticket, TicketStatus } from "../../domain/entities/Ticket";

export interface TicketRepository {
    create(ticket: Ticket): Promise<Ticket>;
    createMany(tickets: Ticket[]): Promise<Ticket[]>;
    findById(ticketId: string): Promise<Ticket | null>;
    findByOrderId(orderId: string): Promise<Ticket[]>;
    countByEventIdAndStatuses(eventId: string, statuses: TicketStatus[]): Promise<number>;
    update(ticket: Ticket): Promise<Ticket | null>;
    updateStatusByIds(ticketIds: string[], status: TicketStatus): Promise<Ticket[]>;
    delete(ticketId: string): Promise<void>;
}
