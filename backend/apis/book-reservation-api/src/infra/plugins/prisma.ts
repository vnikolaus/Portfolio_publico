import { PrismaClient } from '@prisma/client';
import fp from 'fastify-plugin';

declare module "fastify" {
    interface FastifyInstance {
        prisma: PrismaClient;
    }
}

const PrismaPlugin = fp(async fastify => {
    const prisma = new PrismaClient();

    fastify.decorate('prisma', prisma);

    fastify.addHook('onClose', async () => {
        await prisma.$disconnect();
    });
});

export { PrismaPlugin };

