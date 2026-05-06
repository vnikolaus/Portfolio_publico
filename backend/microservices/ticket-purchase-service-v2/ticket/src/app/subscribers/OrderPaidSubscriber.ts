import { z } from "zod";
import type { Queue } from "../../infra/queue/Queue";

const orderPaidSchema = z.object({
    orderId: z.uuid(),
    ticketIds: z.array(z.uuid()).min(1),
});

export class OrderPaidSubscriber {
    constructor(private readonly queue: Queue) {}

    async listen(): Promise<void> {
        await this.queue.on<unknown>("orderPaid", async (payload) => {
            const parsedPayload = orderPaidSchema.parse(payload);

            // {"orderId":"ee9bfe90-b472-49b3-be57-fa2d83ca8f31","ticketIds":["4b832859-f2df-45df-bcaf-4406c92314ac","982299b0-713f-4bdc-bf95-7e87702e0d61"]}

            console.log("Order paid received", parsedPayload);
        });
    }
}
