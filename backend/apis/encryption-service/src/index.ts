import express, { Router } from 'express';
import { Controller } from './controllers/Controller.js';

const app    = express();
const router = Router();

app.use(express.text());
app.use(express.json());
app.use('/', router); // conecta o router no app

const controller = new Controller(router);
controller.start();

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`[API] running at: http://locahost:${port}`);
})
