import { OrderPendingSubscriber } from "../../app/subscribers/OrderPendingSubscriber";
import { ProcessPayment } from "../../app/useCases/ProcessPayment";
import { pool } from "../db/connection";
import { FakePaymentGateway } from "../gateway/FakePaymentGateway";
import { RabbitMQAdapter } from "../queue/RabbitMQAdapter";
import { TransactionRepositoryDatabase } from "../repository/TransactionRepositoryDatabase";

const queue = new RabbitMQAdapter();
const paymentGateway = new FakePaymentGateway();

const transactionRepository = new TransactionRepositoryDatabase(pool);
const processPayment = new ProcessPayment(paymentGateway, transactionRepository);
const orderPendingSubscriber = new OrderPendingSubscriber(queue, processPayment);

export {
    orderPendingSubscriber,
    paymentGateway,
    pool,
    processPayment,
    queue,
    transactionRepository
};

