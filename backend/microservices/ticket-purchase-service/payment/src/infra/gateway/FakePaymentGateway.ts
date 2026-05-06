import { randomInt } from "node:crypto";
import type {
    CreateTransactionInput,
    CreateTransactionOutput,
    PaymentGateway,
} from "../../app/gateways/PaymentGateway";

export class FakePaymentGateway implements PaymentGateway {
    async createTransaction(input: CreateTransactionInput): Promise<CreateTransactionOutput> {
        if (!this.isValidTransaction(input)) {
            return {
                tid: "",
                status: "failed",
            };
        }

        return {
            tid: this.generateTid(),
            status: "paid",
        };
    }

    private isValidTransaction(input: CreateTransactionInput): boolean {
        return (
            this.isValidEmail(input.email) &&
            input.creditCardToken.trim().length >= 3 &&
            input.priceInCents >= 0
        );
    }

    private isValidEmail(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    private generateTid(length = 9, maxRandom = 10): string {
        const rand = Array.from({ length: length }, () => randomInt(maxRandom));
        return rand.join("");
    }
}
