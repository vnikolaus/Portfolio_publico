import type { Pool } from "pg";
import type { TicketRepository } from "../../app/repositories/TicketRepository";
import { Ticket, type TicketStatus } from "../../domain/entities/Ticket";

type TicketRow = {
    ticket_id: string;
    order_id: string;
    event_id: string;
    email: string;
    status: TicketStatus;
    created_at: Date;
};

type CountRow = {
    total: string;
};

export class TicketRepositoryDatabase implements TicketRepository {
    constructor(private readonly pool: Pool) {}

    async create(ticket: Ticket): Promise<Ticket> {
        const result = await this.pool.query<TicketRow>(
            `
            insert into tickets (
                ticket_id,
                order_id,
                event_id,
                email,
                status
            ) values ($1, $2, $3, $4, $5)
            returning *
            `,
            [
                ticket.ticketId,
                ticket.orderId,
                ticket.eventId,
                ticket.email,
                ticket.status,
            ],
        );

        return this.toEntity(result.rows[0]);
    }

    async createMany(tickets: Ticket[]): Promise<Ticket[]> {
        if (tickets.length === 0) return [];

        const columnsPerTicket = 5;
        const values = tickets.flatMap((ticket) => [
            ticket.ticketId,
            ticket.orderId,
            ticket.eventId,
            ticket.email,
            ticket.status,
        ]);
        const placeholders = tickets.map((_, index) => {
            const base = index * columnsPerTicket;

            return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5})`;
        }).join(", ");

        const result = await this.pool.query<TicketRow>(
            `
            insert into tickets (
                ticket_id,
                order_id,
                event_id,
                email,
                status
            ) values ${placeholders}
            returning *
            `,
            values,
        );

        return result.rows.map((row) => this.toEntity(row));
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
                order_id = $3,
                email = $4,
                status = $5
            where ticket_id = $1
            returning *
            `,
            [
                ticket.ticketId,
                ticket.eventId,
                ticket.orderId,
                ticket.email,
                ticket.status,
            ],
        );

        const row = result.rows[0];

        return row ? this.toEntity(row) : null;
    }

    async updateStatusByIds(ticketIds: string[], status: TicketStatus): Promise<Ticket[]> {
        if (ticketIds.length === 0) return [];

        const result = await this.pool.query<TicketRow>(
            `
            update tickets
            set status = $2
            where ticket_id = any($1::uuid[])
            returning *
            `,
            [ticketIds, status],
        );

        return result.rows.map((row) => this.toEntity(row));
    }

    async delete(ticketId: string): Promise<void> {
        await this.pool.query("delete from tickets where ticket_id = $1", [
            ticketId,
        ]);
    }

    async countByEventIdAndStatuses(eventId: string, statuses: TicketStatus[]): Promise<number> {
        const result = await this.pool.query<CountRow>(
            `
            select count(*) as total
            from tickets
            where event_id = $1
            and status = any($2::text[])
            `,
            [eventId, statuses],
        );

        return Number(result.rows[0]?.total ?? 0);
    }

    private toEntity(row: TicketRow): Ticket {
        return Ticket.restore({
            ticketId: row.ticket_id,
            orderId: row.order_id,
            eventId: row.event_id,
            email: row.email,
            status: row.status,
            createdAt: row.created_at,
        });
    }
}
