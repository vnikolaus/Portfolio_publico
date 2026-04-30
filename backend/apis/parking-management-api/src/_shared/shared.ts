import { Router } from "express";
import { Collection } from "klauz-db/lib/Collection.js";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// const ___filename = fileURLToPath(import.meta.url);
const ___dirname = dirname(fileURLToPath(import.meta.url));

export type Config = {
    router: Router,
    db: {
        parking: Collection,
    }
}

export type ParkedCar = {
    id:     string,
    plate:  string,
    parked: boolean,
    info: {
        checkin:   number,
        checkout?: number,
        total:     number,
    }
}

export type KzParkedCar = ParkedCar & {
    _zid: number
}

export const SHARED = Object.freeze({
    PATH_TO_COLLECTIONS: resolve(___dirname, '../../_collections'),
})