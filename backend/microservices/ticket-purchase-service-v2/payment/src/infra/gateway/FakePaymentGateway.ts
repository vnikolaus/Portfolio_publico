import { randomInt } from "node:crypto";
import type {
    CreateTransactionInput,
    CreateTransactionOutput,
    PaymentGateway,
} from "../../app/gateways/PaymentGateway";

export class FakePaymentGateway implements PaymentGateway {
    async createTransaction(input: CreateTransactionInput): Promise<CreateTransactionOutput> {
        if (!input.email || !input.creditCardToken) {
            throw new Error("Invalid transaction");
        }

        return {
            tid: this.generateTid(),
            priceInCents: input.priceInCents,
            status: "approved",
        };
    }

    private generateTid(length = 9, maxInt = 10): string {
        const rand = [];
        for (let i = 0; i < length; i++) {
            rand.push(randomInt(maxInt));
        }
        return rand.join('');
    }
}
