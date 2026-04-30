import { Request, Response } from "express";
import { z } from 'zod';
import type { Config } from "../../_shared/shared.ts";
import { Checkin } from "../useCases/Checkin.js";
import { Checkout } from "../useCases/Checkout.js";

const plateSchema = z.string()
    .trim()
    .transform(plate => plate.replace(/[\s-]/g, '').toUpperCase())
    .pipe(z.string().regex(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/, 'Invalid plate'));

function handleRequestError(res: Response, err: unknown, fallbackMessage = 'Invalid request') {
    if (err instanceof z.ZodError) {
        const issues = err.issues.map(issue => ({
            path: issue.path.join('.'),
            message: issue.message
        }));

        return res.status(400).json({
            error: 'Invalid request body',
            issues
        });
    }

    if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
    }

    return res.status(400).json({ error: fallbackMessage });
}

export class Controller {
    start({ router, db }: Config) {
        router.get('/ping', (req: Request, res: Response) => {
            res.send('pong');
        })

        router.post('/car/checkin', (req: Request, res: Response) => {
            try {
                const schema = z.object({
                    plate: plateSchema
                });
                const { plate } = schema.parse(req.body);

                const checkin = new Checkin(db);
                const result = checkin.exec(plate);

                res.status(201).json({ result });
            } catch (err) {
                handleRequestError(res, err);
            }
        })

        router.patch('/car/checkout', (req: Request, res: Response) => {
            try {
                const schema = z.object({
                    plate: plateSchema
                });
                const { plate } = schema.parse(req.body);

                const checkout = new Checkout(db);
                const result = checkout.exec(plate);

                res.status(200).json({ result });
            } catch (err) {
                handleRequestError(res, err);
            }
        })

        router.get('/car/list', (req: Request, res: Response) => {
            try {
                const cars = db.parking.findAll({ hideInfo: ['_zid'] });
                res.status(200).json({ result: cars });
            } catch (err) {
                handleRequestError(res, err);
            }
        })
    }
}
