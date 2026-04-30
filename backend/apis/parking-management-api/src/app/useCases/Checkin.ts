import { randomUUID as uuid } from "node:crypto";
import { Config, ParkedCar } from "../../_shared/shared.js";

export class Checkin {
    constructor(private readonly db: Config['db']) {}

    exec(plate: string) {
        const rawDB = this.db.parking.find({
            where: (o: ParkedCar) => o.plate === plate && o.parked === true,
        }) as any[];
        if (rawDB?.[0]) throw new Error('Car already parked.');

        const dto: ParkedCar = {
            id: uuid(),
            plate,
            parked: true,
            info: {
                checkin: Date.now(),
                total:   0,
            }
        };
        this.db.parking.add(dto);

        return dto;
    }
}