import "dotenv/config";
import { Pool } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Transaction } from "../../src/domain/entities/Transaction";
import { TransactionRepositoryDatabase } from "../../src/infra/repository/TransactionRepositoryDatabase";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const transactionRepository = new TransactionRepositoryDatabase(pool);

const eventId = "cf3dc26a-36c8-4937-85f1-145ad5a10f77";
const orderId = "4c121a98-173f-4d30-83c3-c1f022f8368d";
const transactionId = "bc990d7d-7ef8-4f90-a6a4-79ca6c0f67d5";

describe("TransactionRepositoryDatabase", () => {
    beforeAll(async () => {
        await pool.query("delete from transactions where transaction_id = $1", [
            transactionId,
        ]);
        await pool.query("delete from orders where order_id = $1", [orderId]);
        await pool.query("delete from events where event_id = $1", [eventId]);

        await pool.query(
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
            `,
            [
                eventId,
                "Sao Paulo Games Expo",
                5000,
                12000,
                "Rodovia dos Imigrantes, Km 1.5",
                "Sao Paulo",
                "SP",
                "Brasil",
                "04329-900",
            ],
        );

        await pool.query(
            `
            insert into orders (
                order_id,
                event_id,
                email,
                quantity,
                total_price_in_cents,
                status
            ) values ($1, $2, $3, $4, $5, $6)
            `,
            [orderId, eventId, "nk@teste.com", 2, 24000, "pending"],
        );
    });

    afterAll(async () => {
        await pool.query("delete from transactions where transaction_id = $1", [
            transactionId,
        ]);
        await pool.query("delete from orders where order_id = $1", [orderId]);
        await pool.query("delete from events where event_id = $1", [eventId]);
        await pool.end();
    });

    it("should create a transaction", async () => {
        const transaction = Transaction.create({
            transactionId,
            orderId,
            tid: "951847623",
            status: "paid",
        });

        const createdTransaction =
            await transactionRepository.create(transaction);

        expect(createdTransaction.transactionId).toBe(transactionId);
        expect(createdTransaction.orderId).toBe(orderId);
        expect(createdTransaction.tid).toBe("951847623");
        expect(createdTransaction.status).toBe("paid");
        expect(createdTransaction.createdAt).toBeInstanceOf(Date);
    });
});
