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
            status: "paid",
        };
    }

    private generateTid(length = 9, maxRandom = 10): string {
        const rand = Array.from({ length: length }, () => randomInt(maxRandom));
        return rand.join("");
    }
}
