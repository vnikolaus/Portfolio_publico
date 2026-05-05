import type { Order } from "../../domain/entities/Order";

export interface OrderRepository {
    create(order: Order): Promise<Order>;
    findById(orderId: string): Promise<Order | null>;
    update(order: Order): Promise<Order | null>;
}
