import { describe, expect, it } from "vitest";

import { Ticket } from "../../src/domain/entities/Ticket";

describe("Ticket", () => {
    it("should create a reserved ticket", () => {
        const ticket = Ticket.create({
            eventId: "c5d1cc9b-b118-48c3-9ab0-b8d7e5277448",
            email: "nk@teste.com",
        });

        expect(ticket.ticketId).toBeDefined();
        expect(ticket.eventId).toBe("c5d1cc9b-b118-48c3-9ab0-b8d7e5277448");
        expect(ticket.email).toBe("nk@teste.com");
        expect(ticket.status).toBe("reserved");
        expect(ticket.createdAt).toBeInstanceOf(Date);
    });

    it("should approve a ticket", () => {
        const ticket = Ticket.create({
            eventId: "c5d1cc9b-b118-48c3-9ab0-b8d7e5277448",
            email: "nk@teste.com",
        });

        ticket.approve();

        expect(ticket.status).toBe("approved");
    });

    it("should reject a ticket", () => {
        const ticket = Ticket.create({
            eventId: "c5d1cc9b-b118-48c3-9ab0-b8d7e5277448",
            email: "nk@teste.com",
        });

        ticket.reject();

        expect(ticket.status).toBe("rejected");
    });

    it("should restore a ticket", () => {
        const createdAt = new Date("2026-05-04T10:00:00.000Z");

        const ticket = Ticket.restore({
            ticketId: "30c4e3b3-5660-466b-9300-9578f910bb5d",
            eventId: "c5d1cc9b-b118-48c3-9ab0-b8d7e5277448",
            email: "nk@teste.com",
            status: "approved",
            createdAt,
        });

        expect(ticket.ticketId).toBe("30c4e3b3-5660-466b-9300-9578f910bb5d");
        expect(ticket.status).toBe("approved");
        expect(ticket.createdAt).toBe(createdAt);
    });
});
