import { z } from "zod";
import type { Queue } from "../../infra/queue/Queue";
import type { ApproveOrder } from "../useCases/ApproveOrder";

const orderPaidSchema = z.object({
    orderId: z.uuid(),
    ticketIds: z.array(z.uuid()).min(1),
});

export class OrderPaidSubscriber {
    constructor(
        private readonly queue: Queue,
        private readonly approveOrder: ApproveOrder,
    ) {}

    async listen(): Promise<void> {
        await this.queue.on<unknown>("orderPaid", async (payload) => {
            const parsedPayload = orderPaidSchema.parse(payload);

            await this.approveOrder.execute(parsedPayload);
        });
    }
}
