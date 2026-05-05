export type PaymentStatus = "approved" | "rejected";

export type CreateTransactionInput = {
    email: string;
    creditCardToken: string;
    priceInCents: number;
};

export type CreateTransactionOutput = {
    tid: string;
    priceInCents: number;
    status: PaymentStatus;
};

export interface PaymentGateway {
    createTransaction(input: CreateTransactionInput): Promise<CreateTransactionOutput>;
}
