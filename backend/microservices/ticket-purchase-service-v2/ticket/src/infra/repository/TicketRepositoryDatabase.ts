import type { Pool } from "pg";

import type { TicketRepository } from "../../app/repositories/TicketRepository";
import { Ticket, type TicketStatus } from "../../domain/entities/Ticket";

type TicketRow = {
    ticket_id: string;
    event_id: string;
    email: string;
    status: TicketStatus;
    created_at: Date;
};

export class TicketRepositoryDatabase implements TicketRepository {
    constructor(private readonly pool: Pool) {}

    async create(ticket: Ticket): Promise<Ticket> {
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

        return this.toEntity(result.rows[0]);
    }

    async findById(ticketId: string): Promise<Ticket | null> {
        const result = await this.pool.query<TicketRow>(
            "select * from tickets where ticket_id = $1",
            [ticketId],
        );

        const row = result.rows[0];

        return row ? this.toEntity(row) : null;
    }

    async update(ticket: Ticket): Promise<Ticket | null> {
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

        return row ? this.toEntity(row) : null;
    }

    async delete(ticketId: string): Promise<void> {
        await this.pool.query("delete from tickets where ticket_id = $1", [
            ticketId,
        ]);
    }

    private toEntity(row: TicketRow): Ticket {
        return Ticket.restore({
            ticketId: row.ticket_id,
            eventId: row.event_id,
            email: row.email,
            status: row.status,
            createdAt: row.created_at,
        });
    }
}
