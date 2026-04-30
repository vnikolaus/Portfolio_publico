import { randomUUID as uuid } from "node:crypto";
import { Config, KzParkedCar, ParkedCar, unwrapKlauzRows } from "../../_shared/shared.js";

export class Checkin {
    constructor(private readonly db: Config['db']) {}

    exec(plate: string) {
        const rawDB = unwrapKlauzRows<KzParkedCar>(this.db.parking.find<ParkedCar>({
            where: (o: ParkedCar) => o.plate === plate && o.parked === true,
        }));
        const car = rawDB?.[0];
        if (car) throw new Error('Car already parked.');

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
