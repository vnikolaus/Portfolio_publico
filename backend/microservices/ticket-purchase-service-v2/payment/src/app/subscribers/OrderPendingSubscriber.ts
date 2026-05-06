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

            await this.processPayment.execute(parsedPayload);
        });
    }
}
