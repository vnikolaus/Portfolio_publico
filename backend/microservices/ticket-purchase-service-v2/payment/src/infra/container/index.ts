import { pool } from "../db/connection";
import { FakePaymentGateway } from "../gateway/FakePaymentGateway";

const paymentGateway = new FakePaymentGateway();

export { paymentGateway, pool };
