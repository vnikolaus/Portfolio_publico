import { OrderPendingSubscriber } from "../../app/subscribers/OrderPendingSubscriber";
import { pool } from "../db/connection";
import { FakePaymentGateway } from "../gateway/FakePaymentGateway";
import { RabbitMQAdapter } from "../queue/RabbitMQAdapter";
import { TransactionRepositoryDatabase } from "../repository/TransactionRepositoryDatabase";

const queue = new RabbitMQAdapter();
const paymentGateway = new FakePaymentGateway();

const transactionRepository = new TransactionRepositoryDatabase(pool);
const orderPendingSubscriber = new OrderPendingSubscriber(queue);

export {
    orderPendingSubscriber,
    paymentGateway,
    pool,
    queue,
    transactionRepository
};

