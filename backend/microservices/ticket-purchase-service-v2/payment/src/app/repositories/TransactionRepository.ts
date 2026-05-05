import type { Transaction } from "../../domain/entities/Transaction";

export interface TransactionRepository {
    create(transaction: Transaction): Promise<Transaction>;
}
