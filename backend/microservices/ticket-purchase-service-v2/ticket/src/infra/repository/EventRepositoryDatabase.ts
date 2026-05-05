import type { Pool } from "pg";

import type {
    CreateEventInput,
    EventRecord,
    EventRepository,
} from "../../app/repositories/EventRepository";

type EventRow = {
    event_id: string;
    description: string;
    capacity: number;
    price_in_cents: number;
    location: string;
    created_at: Date;
};

export class EventRepositoryDatabase implements EventRepository {
    constructor(private readonly pool: Pool) {}

    async create(event: CreateEventInput): Promise<EventRecord> {
        const result = await this.pool.query<EventRow>(
            `
            insert into events (
                event_id,
                description,
                capacity,
                price_in_cents,
                location
            ) values ($1, $2, $3, $4, $5)
            returning *
            `,
            [
                event.eventId,
                event.description,
                event.capacity,
                event.priceInCents,
                event.location,
            ],
        );

        return this.toRecord(result.rows[0]);
    }

    async findById(eventId: string): Promise<EventRecord | null> {
        const result = await this.pool.query<EventRow>(
            "select * from events where event_id = $1",
            [eventId],
        );

        const row = result.rows[0];

        return row ? this.toRecord(row) : null;
    }

    async update(event: CreateEventInput): Promise<EventRecord | null> {
        const result = await this.pool.query<EventRow>(
            `
            update events
            set
                description = $2,
                capacity = $3,
                price_in_cents = $4,
                location = $5
            where event_id = $1
            returning *
            `,
            [
                event.eventId,
                event.description,
                event.capacity,
                event.priceInCents,
                event.location,
            ],
        );

        const row = result.rows[0];

        return row ? this.toRecord(row) : null;
    }

    async delete(eventId: string): Promise<void> {
        await this.pool.query("delete from events where event_id = $1", [eventId]);
    }

    private toRecord(row: EventRow): EventRecord {
        return {
            eventId: row.event_id,
            description: row.description,
            capacity: row.capacity,
            priceInCents: row.price_in_cents,
            location: row.location,
            createdAt: row.created_at,
        };
    }
}
