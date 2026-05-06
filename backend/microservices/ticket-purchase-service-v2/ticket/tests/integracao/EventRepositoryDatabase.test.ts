import "dotenv/config";
import { Pool } from "pg";
import { afterAll, describe, expect, it } from "vitest";
import { Event } from "../../src/domain/entities/Event";
import { EventRepositoryDatabase } from "../../src/infra/repository/EventRepositoryDatabase";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const eventRepository = new EventRepositoryDatabase(pool);
const eventId = "267d40de-56aa-45b6-83a6-64d075a97620";

function makeEvent(overrides?: Partial<Parameters<typeof Event.create>[0]>) {
    return Event.create({
        eventId,
        description: "Sao Paulo Games Expo",
        capacity: 5000,
        priceInCents: 12000,
        address: "Rodovia dos Imigrantes, Km 1.5",
        city: "Sao Paulo",
        state: "SP",
        country: "Brasil",
        zipcode: "04329-900",
        ...overrides,
    });
}

describe("EventRepositoryDatabase", () => {
    afterAll(async () => {
        await pool.query("delete from events where event_id = $1", [eventId]);
        await pool.end();
    });

    it("should create an event", async () => {
        const event = makeEvent();

        const createdEvent = await eventRepository.create(event);

        expect(createdEvent.eventId).toBe(eventId);
        expect(createdEvent.description).toBe("Sao Paulo Games Expo");
        expect(createdEvent.capacity).toBe(5000);
        expect(createdEvent.priceInCents).toBe(12000);
        expect(createdEvent.createdAt).toBeInstanceOf(Date);
    });

    it("should find an event by id", async () => {
        const event = await eventRepository.findById(eventId);

        expect(event?.eventId).toBe(eventId);
        expect(event?.description).toBe("Sao Paulo Games Expo");
    });

    it("should find all events", async () => {
        const events = await eventRepository.findAll();

        expect(events.some((event) => event.eventId === eventId)).toBe(true);
    });

    it("should update an event", async () => {
        const updatedEvent = await eventRepository.update(
            makeEvent({
                description: "Sao Paulo Indie Games Summit",
                capacity: 3000,
                priceInCents: 9000,
            }),
        );

        expect(updatedEvent?.eventId).toBe(eventId);
        expect(updatedEvent?.description).toBe("Sao Paulo Indie Games Summit");
        expect(updatedEvent?.capacity).toBe(3000);
        expect(updatedEvent?.priceInCents).toBe(9000);
    });
});
