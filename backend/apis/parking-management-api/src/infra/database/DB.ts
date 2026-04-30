import { KlauzDB } from "klauz-db";
import { SHARED } from "../../_shared/shared.js";

export class DB {
    private instance: KlauzDB

    constructor() {
        this.instance = new KlauzDB({
            path: SHARED.PATH_TO_COLLECTIONS
        })
    }

    createCollection(name: string) {
        const coll = this.instance.createCollection(name);
        return coll;
    }
}