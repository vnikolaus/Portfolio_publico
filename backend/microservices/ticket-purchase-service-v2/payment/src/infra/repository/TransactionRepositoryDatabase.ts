import type { Pool } from "pg";

import type {
    CreateTransactionInput,
    TransactionRecord,
    TransactionRepository,
    TransactionStatus,
} from "../../app/repositories/TransactionRepository";

type TransactionRow = {
    transaction_id: string;
    ticket_id: string;
    event_id: string;
    price_in_cents: number;
    tid: string | null;
    status: TransactionStatus;
    created_at: Date;
};

export class TransactionRepositoryDatabase implements TransactionRepository {
    constructor(private readonly pool: Pool) {}

    async create(transaction: CreateTransactionInput): Promise<TransactionRecord> {
        const result = await this.pool.query<TransactionRow>(
            `
            insert into transactions (
                transaction_id,
                ticket_id,
                event_id,
                price_in_cents,
                tid,
                status
            ) values ($1, $2, $3, $4, $5, $6)
            returning *
            `,
            [
                transaction.transactionId,
                transaction.ticketId,
                transaction.eventId,
                transaction.priceInCents,
                transaction.tid,
                transaction.status,
            ],
        );

        return this.toRecord(result.rows[0]);
    }

    private toRecord(row: TransactionRow): TransactionRecord {
        return {
            transactionId: row.transaction_id,
            ticketId: row.ticket_id,
            eventId: row.event_id,
            priceInCents: row.price_in_cents,
            tid: row.tid,
            status: row.status,
            createdAt: row.created_at,
        };
    }
}
