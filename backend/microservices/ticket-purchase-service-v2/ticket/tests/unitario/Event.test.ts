import { describe, expect, it } from "vitest";

import { Event } from "../../src/domain/entities/Event";

describe("Event", () => {
    it("should create an event", () => {
        const event = Event.create({
            description: "Tomorrowland Brasil",
            capacity: 100000,
            priceInCents: 150000,
            location: "Parque Maeda - Itu",
        });

        expect(event.eventId).toBeDefined();
        expect(event.description).toBe("Tomorrowland Brasil");
        expect(event.capacity).toBe(100000);
        expect(event.priceInCents).toBe(150000);
        expect(event.location).toBe("Parque Maeda - Itu");
        expect(event.createdAt).toBeInstanceOf(Date);
    });

    it("should restore an event", () => {
        const createdAt = new Date("2026-05-04T10:00:00.000Z");

        const event = Event.restore({
            eventId: "c5d1cc9b-b118-48c3-9ab0-b8d7e5277448",
            description: "Tomorrowland Brasil",
            capacity: 100000,
            priceInCents: 150000,
            location: "Parque Maeda - Itu",
            createdAt,
        });

        expect(event.eventId).toBe("c5d1cc9b-b118-48c3-9ab0-b8d7e5277448");
        expect(event.createdAt).toBe(createdAt);
    });
});
