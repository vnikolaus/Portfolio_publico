import { z } from "zod";
import type { Queue } from "../../infra/queue/Queue";
import type { ProcessPayment } from "../useCases/ProcessPayment";

const orderPendingSchema = z.object({
    orderId: z.uuid(),
    eventId: z.uuid(),
    email: z.email(),
    creditCardToken: z.string().min(1),
    quantity: z.number().int().positive(),
    totalPriceInCents: z.number().int().nonnegative(),
    ticketIds: z.array(z.uuid()).min(1),
});

export class OrderPendingSubscriber {
    constructor(
        private readonly queue: Queue,
        private readonly processPayment: ProcessPayment,
    ) {}

    async listen(): Promise<void> {
        await this.queue.on<unknown>("orderPending", async (payload) => {
            const parsedPayload = orderPendingSchema.parse(payload);

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
            await this.processPayment.execute(parsedPayload);
        });
    }
}
