import { Request, Response, Router } from "express";
import { z } from 'zod';
import { Hasher } from "../services/Hasher.js";

export class Controller {
    constructor(private readonly router: Router) {}

    start() {
        this.router.get('/ping', (req: Request, res: Response) => {
            res.status(200).send('pong');
        });

        this.router.post('/createHash', (req: Request, res: Response) => {
            try {
                const schema     = z.string().min(1);
                const parsedBody = schema.parse(req.body);
                const data       = parsedBody.trim();
                if (!data) throw new Error('Data not found');

                const hash = Hasher.encryptHash(data);
                res.status(201).json({ result: hash });
            } catch (err) {
                res.status(400).json({ error: (err as Error).message });
            }
        })

        this.router.post('/aes/encrypt', (req: Request, res: Response) => {
            try {
                const schema = z.object({
                    key:  z.string().min(1),
                    data: z.string().min(1)
                });
                const { key, data } = schema.parse(req.body);
                const result = Hasher.encryptAES(data, key)
                res.status(201).json({ result });
            } catch (err) {
                res.status(400).json({ error: (err as Error).message });
            }
        })

        this.router.post('/aes/decrypt', (req: Request, res: Response) => {
            try {
                const schema = z.object({
                    encrypted:  z.string().min(1),
                    key:        z.string().min(1),
                    iv:         z.string().min(1),
                    tag:        z.string().min(1)
                });
                const { encrypted, key, iv, tag } = schema.parse(req.body);
                const result = Hasher.decryptAES(encrypted, key, iv, tag);
                res.status(201).json({ result });
            } catch (err) {
                res.status(400).json({ error: (err as Error).message });
            }
        })
    }
}