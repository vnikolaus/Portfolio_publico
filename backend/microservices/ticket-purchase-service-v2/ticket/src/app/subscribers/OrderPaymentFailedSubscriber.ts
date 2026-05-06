import { z } from "zod";
import type { Queue } from "../../infra/queue/Queue";

const orderPaymentFailedSchema = z.object({
    orderId: z.uuid(),
    ticketIds: z.array(z.uuid()).min(1),
});

export class OrderPaymentFailedSubscriber {
    constructor(private readonly queue: Queue) {}

    async listen(): Promise<void> {
        await this.queue.on<unknown>("orderPaymentFailed", async (payload) => {
            const parsedPayload = orderPaymentFailedSchema.parse(payload);

            console.log("Order payment failed received", parsedPayload);
        });
    }
}
