import type { Queue } from "../../infra/queue/Queue";

type TicketReservedPayload = {
    ticketId: string;
    eventId: string;
    email: string;
    creditCardToken: string;
    priceInCents: number;
};

export class TicketReservedSubscriber {
    constructor(private readonly queue: Queue) {}

    async listen(): Promise<void> {
        await this.queue.on<TicketReservedPayload>("ticketReserved", async (payload) => {
                console.log("Ticket reserved received", payload);
            },
        );
    }
}
