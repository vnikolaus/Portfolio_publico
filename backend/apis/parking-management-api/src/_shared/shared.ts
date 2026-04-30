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

type KlauzError = {
    error: string
}

function isKlauzError(value: unknown): value is KlauzError {
    if (!value || typeof value !== 'object') return false;
    const payload = value as Record<string, unknown>;
    return typeof payload.error === 'string';
}

export function unwrapKlauzRows<T>(result: unknown): T[] {
    if (isKlauzError(result)) throw new Error(result.error);
    if (!Array.isArray(result)) return [];
    return result as T[];
}

export const SHARED = Object.freeze({
    PATH_TO_COLLECTIONS: resolve(___dirname, '../../_collections'),
})
