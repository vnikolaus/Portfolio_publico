import { afterEach, describe, expect, it, vi } from "vitest";
import type { PaymentGateway } from "../../src/app/gateways/PaymentGateway";
import type { TransactionRepository } from "../../src/app/repositories/TransactionRepository";
import { ProcessPayment } from "../../src/app/useCases/ProcessPayment";
import type { Transaction } from "../../src/domain/entities/Transaction";
import type { Queue } from "../../src/infra/queue/Queue";

const input = {
    orderId: "4c121a98-173f-4d30-83c3-c1f022f8368d",
    email: "nk@teste.com",
    creditCardToken: "123",
    quantity: 2,
    totalPriceInCents: 24000,
    ticketIds: [
        "f03cb7ef-d34c-410d-9e2b-43f702ec2f30",
        "9e973eb3-e369-44f2-b1d9-c9edc6ab0abd",
    ],
};

describe("ProcessPayment", () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it("should create a paid transaction and publish orderPaid", async () => {
        vi.useFakeTimers();

        const createdTransactions: Transaction[] = [];
        const publishedMessages: Array<{ queueName: string; data: unknown }> = [];

        const paymentGateway: PaymentGateway = {
            createTransaction: async () => ({
                tid: "951847623",
                status: "paid",
            }),
        };

        const transactionRepository: TransactionRepository = {
            create: async (transaction) => {
                createdTransactions.push(transaction);
                return transaction;
            },
        };

        const queue: Queue = {
            connect: async () => undefined,
            close: async () => undefined,
            on: async () => undefined,
            publish: async (queueName, data) => {
                publishedMessages.push({ queueName, data });
            },
        };

        const processPayment = new ProcessPayment(
            paymentGateway,
            transactionRepository,
            queue,
        );

        const promise = processPayment.execute(input);

        await vi.advanceTimersByTimeAsync(5000);
        await promise;

        expect(createdTransactions).toHaveLength(1);
        expect(createdTransactions[0]?.orderId).toBe(input.orderId);
        expect(createdTransactions[0]?.status).toBe("paid");
        expect(publishedMessages).toEqual([
            {
                queueName: "orderPaid",
                data: {
                    orderId: input.orderId,
                    ticketIds: input.ticketIds,
                },
            },
        ]);
    });

    it("should create a failed transaction and publish orderPaymentFailed", async () => {
        vi.useFakeTimers();

        const createdTransactions: Transaction[] = [];
        const publishedMessages: Array<{ queueName: string; data: unknown }> = [];

        const paymentGateway: PaymentGateway = {
            createTransaction: async () => ({
                tid: "",
                status: "failed",
            }),
        };

        const transactionRepository: TransactionRepository = {
            create: async (transaction) => {
                createdTransactions.push(transaction);
                return transaction;
            },
        };

        const queue: Queue = {
            connect: async () => undefined,
            close: async () => undefined,
            on: async () => undefined,
            publish: async (queueName, data) => {
                publishedMessages.push({ queueName, data });
            },
        };

        const processPayment = new ProcessPayment(
            paymentGateway,
            transactionRepository,
            queue,
        );

        const promise = processPayment.execute(input);

        await vi.advanceTimersByTimeAsync(5000);
        await promise;

        expect(createdTransactions).toHaveLength(1);
        expect(createdTransactions[0]?.orderId).toBe(input.orderId);
        expect(createdTransactions[0]?.status).toBe("failed");
        expect(publishedMessages).toEqual([
            {
                queueName: "orderPaymentFailed",
                data: {
                    orderId: input.orderId,
                    ticketIds: input.ticketIds,
                },
            },
        ]);
    });
});
