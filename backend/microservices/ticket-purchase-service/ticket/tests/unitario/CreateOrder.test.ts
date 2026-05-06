import { describe, expect, it } from "vitest";
import type { EventRepository } from "../../src/app/repositories/EventRepository";
import type { OrderRepository } from "../../src/app/repositories/OrderRepository";
import type { TicketRepository } from "../../src/app/repositories/TicketRepository";
import { CreateOrder } from "../../src/app/useCases/CreateOrder";
import { Event } from "../../src/domain/entities/Event";
import type { Order } from "../../src/domain/entities/Order";
import type { Ticket, TicketStatus } from "../../src/domain/entities/Ticket";
import type { Queue } from "../../src/infra/queue/Queue";

describe("CreateOrder", () => {
    it("should create an order with tickets and publish orderPending", async () => {
        const event = Event.create({
            eventId: "267d40de-56aa-45b6-83a6-64d075a97620",
            description: "Sao Paulo Games Expo",
            capacity: 10,
            priceInCents: 12000,
            address: "Rodovia dos Imigrantes, Km 1.5",
            city: "Sao Paulo",
            state: "SP",
            country: "Brasil",
            zipcode: "04329-900",
        });

        const createdOrders: Order[] = [];
        const createdTickets: Ticket[] = [];
        const publishedMessages: Array<{ queueName: string; data: unknown }> = [];

        const eventRepository: EventRepository = {
            create: async (event) => event,
            findAll: async () => [event],
            findById: async () => event,
            update: async (event) => event,
            delete: async () => undefined,
        };

        const orderRepository: OrderRepository = {
            create: async (order) => {
                createdOrders.push(order);
                return order;
            },
            findById: async () => null,
            update: async (order) => order,
            delete: async () => undefined,
        };

        const ticketRepository: TicketRepository = {
            create: async (ticket) => ticket,
            createMany: async (tickets) => {
                createdTickets.push(...tickets);
                return tickets;
            },
            findById: async () => null,
            findByOrderId: async () => [],
            countByEventIdAndStatuses: async () => 0,
            update: async (ticket) => ticket,
            updateStatusByIds: async () => [],
            delete: async () => undefined,
        };

        const queue: Queue = {
            connect: async () => undefined,
            close: async () => undefined,
            on: async () => undefined,
            publish: async (queueName, data) => {
                publishedMessages.push({ queueName, data });
            },
        };

        const createOrder = new CreateOrder(
            eventRepository,
            orderRepository,
            ticketRepository,
            queue,
        );

        const output = await createOrder.execute({
            eventId: "267d40de-56aa-45b6-83a6-64d075a97620",
            email: "nk@teste.com",
            creditCardToken: "123",
            quantity: 2,
        });

        expect(createdOrders).toHaveLength(1);
        expect(createdOrders[0]?.totalPriceInCents).toBe(24000);
        expect(createdTickets).toHaveLength(2);
        expect(output.orderId).toBe(createdOrders[0]?.orderId);
        expect(output.ticketIds).toHaveLength(2);
        expect(publishedMessages[0]?.queueName).toBe("orderPending");
        expect(publishedMessages[0]?.data).toMatchObject({
            orderId: createdOrders[0]?.orderId,
            eventId: "267d40de-56aa-45b6-83a6-64d075a97620",
            email: "nk@teste.com",
            creditCardToken: "123",
            quantity: 2,
            totalPriceInCents: 24000,
        });
    });

    it("should throw when there are not enough tickets available", async () => {
        const event = Event.create({
            eventId: "267d40de-56aa-45b6-83a6-64d075a97620",
            description: "Sao Paulo Games Expo",
            capacity: 2,
            priceInCents: 12000,
            address: "Rodovia dos Imigrantes, Km 1.5",
            city: "Sao Paulo",
            state: "SP",
            country: "Brasil",
            zipcode: "04329-900",
        });

        const eventRepository: EventRepository = {
            create: async (event) => event,
            findAll: async () => [event],
            findById: async () => event,
            update: async (event) => event,
            delete: async () => undefined,
        };

        const orderRepository = {} as OrderRepository;
        const queue = {} as Queue;
        const ticketRepository: TicketRepository = {
            create: async (ticket) => ticket,
            createMany: async (tickets) => tickets,
            findById: async () => null,
            findByOrderId: async () => [],
            countByEventIdAndStatuses: async (
                _eventId: string,
                _statuses: TicketStatus[],
            ) => 1,
            update: async (ticket) => ticket,
            updateStatusByIds: async () => [],
            delete: async () => undefined,
        };

        const createOrder = new CreateOrder(
            eventRepository,
            orderRepository,
            ticketRepository,
            queue,
        );

        await expect(
            createOrder.execute({
                eventId: "267d40de-56aa-45b6-83a6-64d075a97620",
                email: "nk@teste.com",
                creditCardToken: "123",
                quantity: 3,
            }),
        ).rejects.toThrow("Not enough tickets available");
    });
});
