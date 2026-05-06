import type { Pool } from "pg";
import type { TransactionRepository } from "../../app/repositories/TransactionRepository";
import {
    Transaction,
    type TransactionStatus,
} from "../../domain/entities/Transaction";

type TransactionRow = {
    transaction_id: string;
    order_id: string;
    tid: string | null;
    status: TransactionStatus;
    created_at: Date;
};

export class TransactionRepositoryDatabase implements TransactionRepository {
    constructor(private readonly pool: Pool) {}

    async create(transaction: Transaction): Promise<Transaction> {
        const result = await this.pool.query<TransactionRow>(
            `
            insert into transactions (
                transaction_id,
                order_id,
                tid,
                status
            ) values ($1, $2, $3, $4)
            returning *
            `,
            [
                transaction.transactionId,
                transaction.orderId,
                transaction.tid,
                transaction.status,
            ],
        );

        return this.toEntity(result.rows[0]);
    }

    private toEntity(row: TransactionRow): Transaction {
        return Transaction.restore({
            transactionId: row.transaction_id,
            orderId: row.order_id,
            tid: row.tid,
            status: row.status,
            createdAt: row.created_at,
        });
    }
}
