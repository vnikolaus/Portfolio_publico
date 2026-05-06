import "dotenv/config";
import { Pool } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Event } from "../../src/domain/entities/Event";
import { Order } from "../../src/domain/entities/Order";
import { Ticket } from "../../src/domain/entities/Ticket";
import { EventRepositoryDatabase } from "../../src/infra/repository/EventRepositoryDatabase";
import { OrderRepositoryDatabase } from "../../src/infra/repository/OrderRepositoryDatabase";
import { TicketRepositoryDatabase } from "../../src/infra/repository/TicketRepositoryDatabase";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const eventRepository = new EventRepositoryDatabase(pool);
const orderRepository = new OrderRepositoryDatabase(pool);
const ticketRepository = new TicketRepositoryDatabase(pool);

const eventId = "cf3dc26a-36c8-4937-85f1-145ad5a10f77";
const orderId = "4c121a98-173f-4d30-83c3-c1f022f8368d";
const ticketId = "f03cb7ef-d34c-410d-9e2b-43f702ec2f30";
const ticketId2 = "9e973eb3-e369-44f2-b1d9-c9edc6ab0abd";
const ticketId3 = "6c17afe1-1074-4a99-8473-92f5195bd604";

function makeTicket(ticketIdValue: string) {
    return Ticket.create({
        ticketId: ticketIdValue,
        orderId,
        eventId,
        email: "nk@teste.com",
    });
}

describe("TicketRepositoryDatabase", () => {
    beforeAll(async () => {
        await pool.query("delete from tickets where order_id = $1", [orderId]);
        await pool.query("delete from orders where order_id = $1", [orderId]);
        await pool.query("delete from events where event_id = $1", [eventId]);

        await eventRepository.create(
            Event.create({
                eventId,
                description: "Sao Paulo Games Expo",
                capacity: 5000,
                priceInCents: 12000,
                address: "Rodovia dos Imigrantes, Km 1.5",
                city: "Sao Paulo",
                state: "SP",
                country: "Brasil",
                zipcode: "04329-900",
            }),
        );

        await orderRepository.create(
            Order.create({
                orderId,
                eventId,
                email: "nk@teste.com",
                quantity: 3,
                totalPriceInCents: 36000,
            }),
        );
    });

    afterAll(async () => {
        await pool.query("delete from tickets where order_id = $1", [orderId]);
        await pool.query("delete from orders where order_id = $1", [orderId]);
        await pool.query("delete from events where event_id = $1", [eventId]);
        await pool.end();
    });

    it("should create a ticket", async () => {
        const ticket = await ticketRepository.create(makeTicket(ticketId));

        expect(ticket.ticketId).toBe(ticketId);
        expect(ticket.orderId).toBe(orderId);
        expect(ticket.eventId).toBe(eventId);
        expect(ticket.status).toBe("reserved");
    });

    it("should create many tickets", async () => {
        const tickets = await ticketRepository.createMany([
            makeTicket(ticketId2),
            makeTicket(ticketId3),
        ]);

        expect(tickets).toHaveLength(2);
        expect(tickets.map((ticket) => ticket.ticketId)).toEqual([
            ticketId2,
            ticketId3,
        ]);
        expect(tickets.every((ticket) => ticket.status === "reserved")).toBe(
            true,
        );
    });

    it("should find a ticket by id", async () => {
        const ticket = await ticketRepository.findById(ticketId);

        expect(ticket?.ticketId).toBe(ticketId);
        expect(ticket?.orderId).toBe(orderId);
        expect(ticket?.status).toBe("reserved");
    });

    it("should find tickets by order id", async () => {
        const tickets = await ticketRepository.findByOrderId(orderId);

        expect(tickets).toHaveLength(3);
        expect(tickets.every((ticket) => ticket.orderId === orderId)).toBe(true);
    });

    it("should update status by ids", async () => {
        const tickets = await ticketRepository.updateStatusByIds(
            [ticketId2, ticketId3],
            "approved",
        );

        expect(tickets).toHaveLength(2);
        expect(tickets.every((ticket) => ticket.status === "approved")).toBe(
            true,
        );
    });

    it("should count tickets by event id and statuses", async () => {
        const total = await ticketRepository.countByEventIdAndStatuses(eventId, [
            "reserved",
            "approved",
        ]);

        expect(total).toBe(3);
    });
});
