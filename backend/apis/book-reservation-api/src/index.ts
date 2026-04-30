import Fastify from 'fastify';
import { BookRouter } from './app/routes/BookRouter.js';
import { ReservationRouter } from './app/routes/ReservationRouter.js';
import { CronPlugin } from './infra/plugins/cron.js';
import { PrismaPlugin } from './infra/plugins/prisma.js';

const port = process.env.PORT || 3001;
const app  = Fastify({ logger: false });

app.register(PrismaPlugin);
app.register(CronPlugin);

app.register(BookRouter,        { prefix: '/books' });
app.register(ReservationRouter, { prefix: '/reservations' });

app.get('/ping', (_, res) => res.send('pong'));

app.listen({ port: +port }, function (err, address) {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
    console.log("[API] running at:", address);
})