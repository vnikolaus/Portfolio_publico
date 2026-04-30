import { FastifyInstance } from "fastify";
import { BookController } from "../controllers/BookController.js";

export function BookRouter(app: FastifyInstance, options: any) {
    const bookController = new BookController(app);

    app.get('', async (req, res) => {
        try {
            const books = await app.prisma.book.findMany({ include: { reservations: true } });
            res.status(200).send({ result: books });
        } catch (err) {
            res.status(400).send({ error: (err as Error).message });
        }
    })

    app.post('/add', async (req, res) => {
        try {
            const body = req.body as any;
            const r    = await bookController.addBook(body);

            res.status(201).send({ result: r });
        } catch (err) {
            res.status(400).send({ error: (err as Error).message });
        }
    })

    app.patch('/:id', async (req, res) => {
        try {
            const { id } = req.params as { id: string };
            const body   = req.body as any;
            const r      = await bookController.updateBook(id, body);

            res.status(201).send({ result: r });
        } catch (err) {
            res.status(400).send({ error: (err as Error).message });
        }
    })

    app.delete('/:id', async (req, res) => {
        try {
            const { id } = req.params as { id: string };
            await bookController.deleteBook(id);

            res.status(204);
        } catch (err) {
            res.status(400).send({ error: (err as Error).message });
        }
    })
}