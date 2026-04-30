import { Request, Response } from "express";
import { z } from 'zod';
import type { Config } from "../../_shared/shared.ts";
import { Checkin } from "../useCases/Checkin.js";
import { Checkout } from "../useCases/Checkout.js";

export class Controller {
    start({ router, db }: Config) {
        router.get('/ping', (req: Request, res: Response) => {
            res.send('pong');
        })

        router.post('/car/checkin', (req: Request, res: Response) => {
            try {
                const schema = z.object({
                    plate: z.string().min(1)
                });
                const { plate } = schema.parse(req.body);

                const checkin = new Checkin(db);
                const result  = checkin.exec(plate);

                res.status(201).json({ result });
            } catch (err) {
                res.status(400).json({ error: (err as Error).message });
            }
        })

        router.patch('/car/checkout', (req: Request, res: Response) => {
            try {
                const schema = z.object({
                    plate: z.string().min(1)
                });
                const { plate } = schema.parse(req.body);

                const checkout = new Checkout(db);
                const result   = checkout.exec(plate);

                res.status(201).json({ result });
            } catch (err) {
                res.status(400).json({ error: (err as Error).message });
            }
        })

        router.get('/car/list', (req: Request, res: Response) => {
            try {
                const cars = db.parking.findAll({ hideInfo: ['_zid'] });
                res.status(201).json({ result: cars });
            } catch (err) {
                res.status(400).json({ error: (err as Error).message });
            }
        })
    }
}