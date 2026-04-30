import { FastifyInstance } from "fastify";
import { ReservationController } from "../controllers/ReservationController.js";

export function ReservationRouter(app: FastifyInstance, options: any) {
    const reservationController = new ReservationController(app);

    app.post('/add', async (req, res) => {
        try {
            const body = req.body as any;
            const r    = await reservationController.addReservation(body);

            res.status(201).send({ result: r });
        } catch (err) {
            res.status(400).send({ error: (err as Error).message });
        }
    })

    app.patch('/:id', async (req, res) => {
        try {
            const { id } = req.params as { id: string };
            const body   = req.body as any;
            const r      = await reservationController.updateReservation(id, body);

            res.status(201).send({ result: r });
        } catch (err) {
            res.status(400).send({ error: (err as Error).message });
        }
    })

    app.delete('/:id', async (req, res) => {
        try {
            const { id } = req.params as { id: string };
            await reservationController.deleteReservation(id);

            res.status(204);
        } catch (err) {
            res.status(400).send({ error: (err as Error).message });
        }
    })
}