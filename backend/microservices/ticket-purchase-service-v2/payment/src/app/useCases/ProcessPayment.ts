import { Transaction } from "../../domain/entities/Transaction";
import type { Queue } from "../../infra/queue/Queue";
import type { PaymentGateway } from "../gateways/PaymentGateway";
import type { TransactionRepository } from "../repositories/TransactionRepository";

type Input = {
    orderId: string;
    email: string;
    creditCardToken: string;
    quantity: number;
    totalPriceInCents: number;
    ticketIds: string[];
};

export class ProcessPayment {
    constructor(
        private readonly paymentGateway: PaymentGateway,
        private readonly transactionRepository: TransactionRepository,
        private readonly queue: Queue,
    ) {}

    async execute(input: Input): Promise<void> {
        const gatewayOutput = await this.paymentGateway.createTransaction({
            email: input.email,
            creditCardToken: input.creditCardToken,
            priceInCents: input.totalPriceInCents,
        });

        const transaction = Transaction.create({
            orderId: input.orderId,
            tid: gatewayOutput.tid,
            status: gatewayOutput.status,
        });

        await this.transactionRepository.create(transaction);

        console.log("transaction: ", transaction);

        if (transaction.status === "paid") {
            await this.queue.publish("orderPaid", {
                orderId: input.orderId,
                ticketIds: input.ticketIds,
            });
            return;
        }

        await this.queue.publish("orderPaymentFailed", {
            orderId: input.orderId,
            ticketIds: input.ticketIds,
        });
    }
}
