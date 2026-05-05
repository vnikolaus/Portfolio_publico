export type TransactionStatus = "pending" | "paid" | "failed";

export type TransactionRecord = {
    transactionId: string;
    ticketId: string;
    eventId: string;
    priceInCents: number;
    tid: string | null;
    status: TransactionStatus;
    createdAt: Date;
};

export type CreateTransactionInput = Omit<TransactionRecord, "createdAt">;

export interface TransactionRepository {
    create(transaction: CreateTransactionInput): Promise<TransactionRecord>;
}
