export type PaymentStatus = "paid" | "failed";

export type CreateTransactionInput = {
    email: string;
    creditCardToken: string;
    priceInCents: number;
};

export type CreateTransactionOutput = {
    tid: string;
    status: PaymentStatus;
};

export interface PaymentGateway {
    createTransaction(input: CreateTransactionInput): Promise<CreateTransactionOutput>;
}
