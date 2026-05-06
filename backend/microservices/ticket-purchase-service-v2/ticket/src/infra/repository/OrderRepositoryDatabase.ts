import type { Pool } from "pg";
import type { OrderRepository } from "../../app/repositories/OrderRepository";
import { Order, type OrderStatus } from "../../domain/entities/Order";

type OrderRow = {
    order_id: string;
    event_id: string;
    email: string;
    quantity: number;
    total_price_in_cents: number;
    status: OrderStatus;
    created_at: Date;
};

export class OrderRepositoryDatabase implements OrderRepository {
    constructor(private readonly pool: Pool) {}

    async create(order: Order): Promise<Order> {
        const result = await this.pool.query<OrderRow>(
            `
            insert into orders (
                order_id,
                event_id,
                email,
                quantity,
                total_price_in_cents,
                status
            ) values ($1, $2, $3, $4, $5, $6)
            returning *
            `,
            [
                order.orderId,
                order.eventId,
                order.email,
                order.quantity,
                order.totalPriceInCents,
                order.status,
            ],
        );

        return this.toEntity(result.rows[0]);
    }

    async findById(orderId: string): Promise<Order | null> {
        const result = await this.pool.query<OrderRow>(
            "select * from orders where order_id = $1",
            [orderId],
        );

        const row = result.rows[0];

        return row ? this.toEntity(row) : null;
    }

    async update(order: Order): Promise<Order | null> {
        const result = await this.pool.query<OrderRow>(
            `
            update orders
            set
                event_id = $2,
                email = $3,
                quantity = $4,
                total_price_in_cents = $5,
                status = $6
            where order_id = $1
            returning *
            `,
            [
                order.orderId,
                order.eventId,
                order.email,
                order.quantity,
                order.totalPriceInCents,
                order.status,
            ],
        );

        const row = result.rows[0];

        return row ? this.toEntity(row) : null;
    }

    async delete(orderId: string): Promise<void> {
        await this.pool.query("delete from orders where order_id = $1", [orderId]);
    }

    private toEntity(row: OrderRow): Order {
        return Order.restore({
            orderId: row.order_id,
            eventId: row.event_id,
            email: row.email,
            quantity: row.quantity,
            totalPriceInCents: row.total_price_in_cents,
            status: row.status,
            createdAt: row.created_at,
        });
    }
}
