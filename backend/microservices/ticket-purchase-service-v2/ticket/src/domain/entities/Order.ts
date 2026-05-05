import { randomUUID } from "node:crypto";

export type OrderStatus = "pending" | "paid" | "cancelled";

type OrderProps = {
    orderId: string;
    eventId: string;
    email: string;
    quantity: number;
    totalPriceInCents: number;
    status: OrderStatus;
    createdAt: Date;
};

type CreateOrderProps = Omit<OrderProps, "orderId" | "status" | "createdAt"> & {
    orderId?: string;
};

export class Order {
    private constructor(private readonly props: OrderProps) {}

    static create(props: CreateOrderProps): Order {
        return new Order({
            orderId: props.orderId ?? randomUUID(),
            eventId: props.eventId,
            email: props.email,
            quantity: props.quantity,
            totalPriceInCents: props.totalPriceInCents,
            status: "pending",
            createdAt: new Date(),
        });
    }

    static restore(props: OrderProps): Order {
        return new Order(props);
    }

    pay(): void {
        this.props.status = "paid";
    }

    cancel(): void {
        this.props.status = "cancelled";
    }

    get orderId(): string {
        return this.props.orderId;
    }

    get eventId(): string {
        return this.props.eventId;
    }

    get email(): string {
        return this.props.email;
    }

    get quantity(): number {
        return this.props.quantity;
    }

    get totalPriceInCents(): number {
        return this.props.totalPriceInCents;
    }

    get status(): OrderStatus {
        return this.props.status;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }
}
