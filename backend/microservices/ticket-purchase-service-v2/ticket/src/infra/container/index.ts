import { BuyTicketController } from "../../app/controllers/BuyTicketController";
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

const buyTicket = new BuyTicket(eventRepository, ticketRepository, queue);
const buyTicketController = new BuyTicketController(buyTicket);

export {
    buyTicket,
    buyTicketController,
    eventRepository,
    orderRepository,
    pool,
    queue,
    ticketRepository
};

