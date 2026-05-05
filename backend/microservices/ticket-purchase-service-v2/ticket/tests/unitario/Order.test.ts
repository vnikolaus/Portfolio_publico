import { describe, expect, it } from "vitest";
import { Order } from "../../src/domain/entities/Order";

describe("Order", () => {
    it("should create a pending order", () => {
        const order = Order.create({
            eventId: "c5d1cc9b-b118-48c3-9ab0-b8d7e5277448",
            email: "nk@teste.com",
            quantity: 2,
            totalPriceInCents: 17000,
        });

        expect(order.orderId).toBeDefined();
        expect(order.eventId).toBe("c5d1cc9b-b118-48c3-9ab0-b8d7e5277448");
        expect(order.email).toBe("nk@teste.com");
        expect(order.quantity).toBe(2);
        expect(order.totalPriceInCents).toBe(17000);
        expect(order.status).toBe("pending");
        expect(order.createdAt).toBeInstanceOf(Date);
    });

    it("should mark an order as paid", () => {
        const order = Order.create({
            eventId: "c5d1cc9b-b118-48c3-9ab0-b8d7e5277448",
            email: "nk@teste.com",
            quantity: 2,
            totalPriceInCents: 17000,
        });

        order.pay();

        expect(order.status).toBe("paid");
    });

    it("should cancel an order", () => {
        const order = Order.create({
            eventId: "c5d1cc9b-b118-48c3-9ab0-b8d7e5277448",
            email: "nk@teste.com",
            quantity: 2,
            totalPriceInCents: 17000,
        });

        order.cancel();

        expect(order.status).toBe("cancelled");
    });

    it("should restore an order", () => {
        const createdAt = new Date("2026-05-05T10:00:00.000Z");

        const order = Order.restore({
            orderId: "268cf4fb-a18f-4731-bb99-15f893ad2c12",
            eventId: "c5d1cc9b-b118-48c3-9ab0-b8d7e5277448",
            email: "nk@teste.com",
            quantity: 2,
            totalPriceInCents: 17000,
            status: "paid",
            createdAt,
        });

        expect(order.orderId).toBe("268cf4fb-a18f-4731-bb99-15f893ad2c12");
        expect(order.status).toBe("paid");
        expect(order.createdAt).toBe(createdAt);
    });
});
