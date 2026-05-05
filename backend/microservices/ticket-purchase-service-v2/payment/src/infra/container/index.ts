import { TicketReservedSubscriber } from "../../app/subscribers/TicketReservedSubscriber";
import { pool } from "../db/connection";
import { FakePaymentGateway } from "../gateway/FakePaymentGateway";
import { RabbitMQAdapter } from "../queue/RabbitMQAdapter";
import { TransactionRepositoryDatabase } from "../repository/TransactionRepositoryDatabase";

const paymentGateway = new FakePaymentGateway();
const queue = new RabbitMQAdapter();
const ticketReservedSubscriber = new TicketReservedSubscriber(queue);
const transactionRepository = new TransactionRepositoryDatabase(pool);

export {
    paymentGateway,
    pool,
    queue,
    ticketReservedSubscriber,
    transactionRepository,
};
