import type { Queue } from "../../infra/queue/Queue";

type OrderPendingPayload = {
    orderId: string;
    eventId: string;
    email: string;
    creditCardToken: string;
    quantity: number;
    totalPriceInCents: number;
    ticketIds: string[];
};

export class OrderPendingSubscriber {
    constructor(private readonly queue: Queue) {}

    async listen(): Promise<void> {
        await this.queue.on<OrderPendingPayload>("orderPending", async (payload) => {
            // Pending order received {
            //     orderId: '9abb2acf-ef7f-4b4d-9cb6-dbd956f5e93f',
            //     eventId: '267d40de-56aa-45b6-83a6-64d075a97620',
            //     email: 'john@doe.com',
            //     creditCardToken: '123456',
            //     quantity: 2,
            //     totalPriceInCents: 17000,
            //     ticketIds: [
            //         '098d003f-746b-4779-bd2c-2fa968c2ad18',
            //         'd92c4269-fda6-4405-bfde-fd0c63b09e57'
            //     ]
            // }
            console.log("Pending order received", payload);
        });
    }
}
