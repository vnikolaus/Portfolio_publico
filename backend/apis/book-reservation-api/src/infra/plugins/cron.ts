import fp from 'fastify-plugin';
import { schedule } from 'node-cron';
import { Utils } from '../../app/utils/Utils.js';

const CronPlugin = fp(async fastify => {
    schedule('*/10 * * * *', async () => {
        const nowISO = Utils.toBrazilISO(new Date());
        const now    = new Date(nowISO);

        // Atualiza reservas pendentes que já começaram
        await fastify.prisma.reservation.updateMany({
            where: {
                status: 'PENDING',
                start_date: { lte: now }
            },
            data: { status: 'ACTIVE' }
        });

        // Atualiza reservas ativas que já terminaram
        await fastify.prisma.reservation.updateMany({
            where: {
                status: 'ACTIVE',
                end_date: { lt: now }
            },
            data: { status: 'FINISHED' }
        });

        console.log('[Job] Status das reservas atualizado');
    });
});

export { CronPlugin };

