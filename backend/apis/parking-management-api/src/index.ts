import express, { Router } from 'express';
import { Config } from './_shared/shared.js';
import { Controller } from './app/controllers/Controller.js';
import { DB } from "./infra/database/DB.js";

const app    = express();
const router = Router({ caseSensitive: true });

app.use(express.json());
app.use('/', router);

const db         = new DB();
const collection = db.createCollection('parking');
const controller = new Controller();

const config: Config = {
    router,
    db: {
        parking: collection
    }
};

controller.start(config);

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`[API] running at: http://locahost:${port}`);
})
