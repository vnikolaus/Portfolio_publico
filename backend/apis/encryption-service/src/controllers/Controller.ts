import { Request, Response, Router } from "express";
import { z } from 'zod';
import { Hasher } from "../services/Hasher.js";

const hexSchema = z.string().regex(/^[0-9a-f]+$/i);

class RequestError extends Error {}

function handleRequestError(res: Response, err: unknown, fallbackMessage = 'Invalid request') {
    if (err instanceof z.ZodError) {
        const issues = err.issues.map(issue => ({
            path:    issue.path.join('.'),
            message: issue.message
        }));

        return res.status(400).json({
            error: 'Invalid request body',
            issues
        });
    }

    if (err instanceof RequestError) {
        return res.status(400).json({ error: err.message });
    }

    return res.status(400).json({ error: fallbackMessage });
}

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
                if (!data) throw new RequestError('Data not found');

                const hash = Hasher.encryptHash(data);
                res.status(201).json({ result: hash });
            } catch (err) {
                handleRequestError(res, err);
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
                handleRequestError(res, err);
            }
        })

        this.router.post('/aes/decrypt', (req: Request, res: Response) => {
            try {
                const schema = z.object({
                    encrypted:  hexSchema.min(1),
                    key:        z.string().min(1),
                    iv:         hexSchema.length(24),
                    tag:        hexSchema.length(32),
                    salt:       hexSchema.length(32)
                });
                const { encrypted, key, iv, tag, salt } = schema.parse(req.body);
                const result = Hasher.decryptAES(encrypted, key, iv, tag, salt);
                res.status(200).json({ result });
            } catch (err) {
                handleRequestError(res, err, 'Invalid encrypted payload or key');
            }
        })
    }
}
