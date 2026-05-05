import { describe, expect, it } from "vitest";

import { Transaction } from "../../src/domain/entities/Transaction";

describe("Transaction", () => {
    it("should create a transaction", () => {
        const transaction = Transaction.create({
            ticketId: "30c4e3b3-5660-466b-9300-9578f910bb5d",
            eventId: "c5d1cc9b-b118-48c3-9ab0-b8d7e5277448",
            priceInCents: 150000,
            tid: "951847623",
            status: "paid",
        });

        expect(transaction.transactionId).toBeDefined();
        expect(transaction.ticketId).toBe(
            "30c4e3b3-5660-466b-9300-9578f910bb5d",
        );
        expect(transaction.eventId).toBe(
            "c5d1cc9b-b118-48c3-9ab0-b8d7e5277448",
        );
        expect(transaction.priceInCents).toBe(150000);
        expect(transaction.tid).toBe("951847623");
        expect(transaction.status).toBe("paid");
        expect(transaction.createdAt).toBeInstanceOf(Date);
    });

    it("should restore a transaction", () => {
        const createdAt = new Date("2026-05-05T10:00:00.000Z");

        const transaction = Transaction.restore({
            transactionId: "ffb880f3-3560-4a1b-8a5c-bcf2f37959c7",
            ticketId: "30c4e3b3-5660-466b-9300-9578f910bb5d",
            eventId: "c5d1cc9b-b118-48c3-9ab0-b8d7e5277448",
            priceInCents: 150000,
            tid: "951847623",
            status: "failed",
            createdAt,
        });

        expect(transaction.transactionId).toBe(
            "ffb880f3-3560-4a1b-8a5c-bcf2f37959c7",
        );
        expect(transaction.status).toBe("failed");
        expect(transaction.createdAt).toBe(createdAt);
    });
});
