import "dotenv/config";
import { Pool } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Event } from "../../src/domain/entities/Event";
import { Order } from "../../src/domain/entities/Order";
import { EventRepositoryDatabase } from "../../src/infra/repository/EventRepositoryDatabase";
import { OrderRepositoryDatabase } from "../../src/infra/repository/OrderRepositoryDatabase";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const eventRepository = new EventRepositoryDatabase(pool);
const orderRepository = new OrderRepositoryDatabase(pool);

const eventId = "8d5a2f0c-4b8e-44f1-b2e9-6f39af8a51e1";
const orderId = "c04d31e7-1cb8-4c8a-b9ad-8f792961fdc7";

function makeOrder(overrides?: Partial<Parameters<typeof Order.create>[0]>) {
    return Order.create({
        orderId,
        eventId,
        email: "nk@teste.com",
        quantity: 2,
        totalPriceInCents: 17000,
        ...overrides,
    });
}

describe("OrderRepositoryDatabase", () => {
    beforeAll(async () => {
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
    });

    afterAll(async () => {
        await pool.query("delete from orders where order_id = $1", [orderId]);
        await pool.query("delete from events where event_id = $1", [eventId]);
        await pool.end();
    });

    it("should create an order", async () => {
        const order = await orderRepository.create(makeOrder());

        expect(order.orderId).toBe(orderId);
        expect(order.eventId).toBe(eventId);
        expect(order.status).toBe("pending");
    });

    it("should find an order by id", async () => {
        const order = await orderRepository.findById(orderId);

        expect(order?.orderId).toBe(orderId);
        expect(order?.email).toBe("nk@teste.com");
    });

    it("should update an order", async () => {
        const order = makeOrder();

        order.pay();

        const updatedOrder = await orderRepository.update(order);

        expect(updatedOrder?.orderId).toBe(orderId);
        expect(updatedOrder?.status).toBe("paid");
    });

});
