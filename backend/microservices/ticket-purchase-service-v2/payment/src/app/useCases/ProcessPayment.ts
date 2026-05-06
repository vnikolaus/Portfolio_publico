import { Transaction } from "../../domain/entities/Transaction";
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
    }
}
