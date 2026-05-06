import { CreateOrderController } from "../../app/controllers/CreateOrderController";
import { EventController } from "../../app/controllers/EventController";
import { GetOrderController } from "../../app/controllers/GetOrderController";
import { OrderPaidSubscriber } from "../../app/subscribers/OrderPaidSubscriber";
import { OrderPaymentFailedSubscriber } from "../../app/subscribers/OrderPaymentFailedSubscriber";
import { ApproveOrder } from "../../app/useCases/ApproveOrder";
import { CancelOrder } from "../../app/useCases/CancelOrder";
import { BuyTicket } from "../../app/useCases/CreateOrder";
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
const eventController = new EventController(eventRepository);
const createOrderController = new CreateOrderController(buyTicket);
const getOrderController = new GetOrderController(
    orderRepository,
    ticketRepository,
);
const approveOrder = new ApproveOrder(orderRepository, ticketRepository);
const cancelOrder = new CancelOrder(orderRepository, ticketRepository);
const orderPaidSubscriber = new OrderPaidSubscriber(queue, approveOrder);
const orderPaymentFailedSubscriber = new OrderPaymentFailedSubscriber(
    queue,
    cancelOrder,
);

export {
    approveOrder,
    buyTicket,
    cancelOrder,
    createOrderController,
    eventController,
    eventRepository,
    getOrderController,
    orderPaidSubscriber,
    orderPaymentFailedSubscriber,
    orderRepository,
    pool,
    queue,
    ticketRepository
};

