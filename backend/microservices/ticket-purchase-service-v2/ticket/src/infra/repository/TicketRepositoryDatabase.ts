import type { Pool } from "pg";

import type {
    CreateTicketInput,
    TicketRecord,
    TicketRepository,
    TicketStatus,
} from "../../app/repositories/TicketRepository";

type TicketRow = {
    ticket_id: string;
    event_id: string;
    email: string;
    status: TicketStatus;
    created_at: Date;
};

export class TicketRepositoryDatabase implements TicketRepository {
    constructor(private readonly pool: Pool) {}

    async create(ticket: CreateTicketInput): Promise<TicketRecord> {
        const result = await this.pool.query<TicketRow>(
            `
            insert into tickets (
                ticket_id,
                event_id,
                email,
                status
            ) values ($1, $2, $3, $4)
            returning *
            `,
            [ticket.ticketId, ticket.eventId, ticket.email, ticket.status],
        );

        return this.toRecord(result.rows[0]);
    }

    async findById(ticketId: string): Promise<TicketRecord | null> {
        const result = await this.pool.query<TicketRow>(
            "select * from tickets where ticket_id = $1",
            [ticketId],
        );

        const row = result.rows[0];

        return row ? this.toRecord(row) : null;
    }

    async update(ticket: CreateTicketInput): Promise<TicketRecord | null> {
        const result = await this.pool.query<TicketRow>(
            `
            update tickets
            set
                event_id = $2,
                email = $3,
                status = $4
            where ticket_id = $1
            returning *
            `,
            [ticket.ticketId, ticket.eventId, ticket.email, ticket.status],
        );

        const row = result.rows[0];

        return row ? this.toRecord(row) : null;
    }

    async delete(ticketId: string): Promise<void> {
        await this.pool.query("delete from tickets where ticket_id = $1", [
            ticketId,
        ]);
    }

    private toRecord(row: TicketRow): TicketRecord {
        return {
            ticketId: row.ticket_id,
            eventId: row.event_id,
            email: row.email,
            status: row.status,
            createdAt: row.created_at,
        };
    }
}
