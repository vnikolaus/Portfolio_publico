import amqp, { type Channel, type ChannelModel } from "amqplib";
import type { Queue } from "./Queue";

export class RabbitMQAdapter implements Queue {
    private connection?: ChannelModel;
    private channel?: Channel;

    async connect(): Promise<void> {
        const amqpUrl = process.env.AMQP_URL;

        if (!amqpUrl) {
            throw new Error("AMQP_URL is required");
        }

        this.connection = await amqp.connect(amqpUrl);
        this.channel = await this.connection.createChannel();
    }

    async close(): Promise<void> {
        await this.channel?.close();
        await this.connection?.close();
    }

    async on<T = unknown>(queueName: string, callback: (data: T) => Promise<void> | void): Promise<void> {
        const channel = this.getChannel();

        await channel.assertQueue(queueName, { durable: true });

        await channel.consume(queueName, async (message) => {
            if (!message) return;

            try {
                const data = JSON.parse(message.content.toString()) as T;

                await callback(data);
                channel.ack(message);
            } catch (error) {
                channel.nack(message, false, false);
                throw error;
            }
        });
    }

    async publish(queueName: string, data: unknown): Promise<void> {
        const channel = this.getChannel();

        await channel.assertQueue(queueName, { durable: true });

        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), {
            persistent: true,
        });
    }

    private getChannel(): Channel {
        if (!this.channel) {
            throw new Error("RabbitMQ channel is not connected");
        }

        return this.channel;
    }
}
