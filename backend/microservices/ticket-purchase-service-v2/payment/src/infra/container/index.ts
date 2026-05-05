import { pool } from "../db/connection";
import { FakePaymentGateway } from "../gateway/FakePaymentGateway";
import { TransactionRepositoryDatabase } from "../repository/TransactionRepositoryDatabase";

const paymentGateway = new FakePaymentGateway();
const transactionRepository = new TransactionRepositoryDatabase(pool);

export { paymentGateway, pool, transactionRepository };
