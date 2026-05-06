import { describe, expect, it } from "vitest";
import { Transaction } from "../../src/domain/entities/Transaction";

describe("Transaction", () => {
    it("should create a transaction", () => {
        const transaction = Transaction.create({
            orderId: "268cf4fb-a18f-4731-bb99-15f893ad2c12",
            tid: "951847623",
            status: "paid",
        });

        expect(transaction.transactionId).toBeDefined();
        expect(transaction.orderId).toBe(
            "268cf4fb-a18f-4731-bb99-15f893ad2c12",
        );
        expect(transaction.tid).toBe("951847623");
        expect(transaction.status).toBe("paid");
        expect(transaction.createdAt).toBeInstanceOf(Date);
    });

    it("should restore a transaction", () => {
        const createdAt = new Date("2026-05-05T10:00:00.000Z");

        const transaction = Transaction.restore({
            transactionId: "ffb880f3-3560-4a1b-8a5c-bcf2f37959c7",
            orderId: "268cf4fb-a18f-4731-bb99-15f893ad2c12",
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
