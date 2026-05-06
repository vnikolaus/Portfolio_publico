import { CreateOrderController } from "../../app/controllers/CreateOrderController";
import { GetOrderController } from "../../app/controllers/GetOrderController";
import { OrderPaidSubscriber } from "../../app/subscribers/OrderPaidSubscriber";
import { OrderPaymentFailedSubscriber } from "../../app/subscribers/OrderPaymentFailedSubscriber";
import { ApproveOrder } from "../../app/useCases/ApproveOrder";
import { BuyTicket } from "../../app/useCases/BuyTicket";
import { pool } from "../db/connection";
import { RabbitMQAdapter } from "../queue/RabbitMQAdapter";
import { EventRepositoryDatabase } from "../repository/EventRepositoryDatabase";
import { OrderRepositoryDatabase } from "../repository/OrderRepositoryDatabase";
import { TicketRepositoryDatabase } from "../repository/TicketRepositoryDatabase";

const queue = new RabbitMQAdapter();

const eventRepository = new EventRepositoryDatabase(pool);
const orderRepository = new OrderRepositoryDatabase(pool);
const ticketRepository = new TicketRepositoryDatabase(pool);

const buyTicket = new BuyTicket(
    eventRepository,
    orderRepository,
    ticketRepository,
    queue,
);
const createOrderController = new CreateOrderController(buyTicket);
const getOrderController = new GetOrderController(
    orderRepository,
    ticketRepository,
);
const approveOrder = new ApproveOrder(orderRepository, ticketRepository);
const orderPaidSubscriber = new OrderPaidSubscriber(queue, approveOrder);
const orderPaymentFailedSubscriber = new OrderPaymentFailedSubscriber(queue);

export {
    approveOrder,
    buyTicket,
    createOrderController,
    eventRepository,
    getOrderController,
    orderPaidSubscriber,
    orderPaymentFailedSubscriber,
    orderRepository,
    pool,
    queue,
    ticketRepository,
};

