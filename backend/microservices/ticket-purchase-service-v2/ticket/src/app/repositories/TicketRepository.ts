export type TicketStatus = "reserved" | "approved" | "rejected";

export type TicketRecord = {
    ticketId: string;
    eventId: string;
    email: string;
    status: TicketStatus;
    createdAt: Date;
};

export type CreateTicketInput = Omit<TicketRecord, "createdAt">;

export interface TicketRepository {
    create(ticket: CreateTicketInput): Promise<TicketRecord>;
    findById(ticketId: string): Promise<TicketRecord | null>;
    update(ticket: CreateTicketInput): Promise<TicketRecord | null>;
    delete(ticketId: string): Promise<void>;
}
