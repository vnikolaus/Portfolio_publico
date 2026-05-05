import type { Pool } from "pg";
import type { EventRepository } from "../../app/repositories/EventRepository";
import { Event } from "../../domain/entities/Event";

type EventRow = {
    event_id: string;
    description: string;
    capacity: number;
    price_in_cents: number;
    address: string;
    city: string;
    state: string;
    country: string;
    zipcode: string;
    created_at: Date;
};

export class EventRepositoryDatabase implements EventRepository {
    constructor(private readonly pool: Pool) {}

    async create(event: Event): Promise<Event> {
        const result = await this.pool.query<EventRow>(
            `
            insert into events (
                event_id,
                description,
                capacity,
                price_in_cents,
                address,
                city,
                state,
                country,
                zipcode
            ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            returning *
            `,
            [
                event.eventId,
                event.description,
                event.capacity,
                event.priceInCents,
                event.address,
                event.city,
                event.state,
                event.country,
                event.zipcode,
            ],
        );

        return this.toEntity(result.rows[0]);
    }

    async findById(eventId: string): Promise<Event | null> {
        const result = await this.pool.query<EventRow>(
            "select * from events where event_id = $1",
            [eventId],
        );

        const row = result.rows[0];

        return row ? this.toEntity(row) : null;
    }

    async update(event: Event): Promise<Event | null> {
        const result = await this.pool.query<EventRow>(
            `
            update events
            set
                description = $2,
                capacity = $3,
                price_in_cents = $4,
                address = $5,
                city = $6,
                state = $7,
                country = $8,
                zipcode = $9
            where event_id = $1
            returning *
            `,
            [
                event.eventId,
                event.description,
                event.capacity,
                event.priceInCents,
                event.address,
                event.city,
                event.state,
                event.country,
                event.zipcode,
            ],
        );

        const row = result.rows[0];

        return row ? this.toEntity(row) : null;
    }

    async delete(eventId: string): Promise<void> {
        await this.pool.query("delete from events where event_id = $1", [eventId]);
    }

    private toEntity(row: EventRow): Event {
        return Event.restore({
            eventId: row.event_id,
            description: row.description,
            capacity: row.capacity,
            priceInCents: row.price_in_cents,
            address: row.address,
            city: row.city,
            state: row.state,
            country: row.country,
            zipcode: row.zipcode,
            createdAt: row.created_at,
        });
    }
}
