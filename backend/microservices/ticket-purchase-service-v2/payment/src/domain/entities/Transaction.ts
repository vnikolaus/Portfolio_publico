import { randomUUID } from "node:crypto";

export type TransactionStatus = "pending" | "paid" | "failed";

type TransactionProps = {
    transactionId: string;
    ticketId: string;
    eventId: string;
    priceInCents: number;
    tid: string | null;
    status: TransactionStatus;
    createdAt: Date;
};

type CreateTransactionProps = Omit<TransactionProps, "transactionId" | "createdAt"> & {
    transactionId?: string;
};

export class Transaction {
    private constructor(private readonly props: TransactionProps) {}

    static create(props: CreateTransactionProps): Transaction {
        return new Transaction({
            transactionId: props.transactionId ?? randomUUID(),
            ticketId: props.ticketId,
            eventId: props.eventId,
            priceInCents: props.priceInCents,
            tid: props.tid,
            status: props.status,
            createdAt: new Date(),
        });
    }

    static restore(props: TransactionProps): Transaction {
        return new Transaction(props);
    }

    get transactionId(): string {
        return this.props.transactionId;
    }

    get ticketId(): string {
        return this.props.ticketId;
    }

    get eventId(): string {
        return this.props.eventId;
    }

    get priceInCents(): number {
        return this.props.priceInCents;
    }

    get tid(): string | null {
        return this.props.tid;
    }

    get status(): TransactionStatus {
        return this.props.status;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }
}
