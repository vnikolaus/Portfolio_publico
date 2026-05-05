import { BuyTicketController } from "../../app/controllers/BuyTicketController";
import { BuyTicket } from "../../app/useCases/BuyTicket";
import { pool } from "../db/connection";
import { TicketRepositoryDatabase } from "../repository/TicketRepositoryDatabase";

const ticketRepository = new TicketRepositoryDatabase(pool);
const buyTicket = new BuyTicket(ticketRepository);
const buyTicketController = new BuyTicketController(buyTicket);

export { buyTicket, buyTicketController, pool, ticketRepository };
