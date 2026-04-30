import { Config, KzParkedCar, ParkedCar } from "../../_shared/shared.js";
import { CalculatePrice } from "./CalculatePrice.js";

export class Checkout {
    constructor(private readonly db: Config['db']) {}

    exec(plate: string) {
        const rawDB = this.db.parking.find({
            where: (o: ParkedCar) => o.plate === plate && o.parked === true,
        }) as any[];
        const car = rawDB?.[0] as KzParkedCar;
        if (!car) throw new Error('Car isnt parked.')

        const calculate = new CalculatePrice();
        const _in       = car.info.checkin;
        const _out      = Date.now();
        // const _out      = _in + (1 * 60 + 15) * 60 * 1000;
        const total     = calculate.exec(_in, _out);

        const dto: ParkedCar = {
            id:     car.id,
            plate:  car.plate,
            parked: false,
            info: {
                checkin:  car.info.checkin,
                checkout: new Date().getTime(),
                total,
            }
        }
        this.db.parking.update({
            where: (o: ParkedCar) => o.id === car.id,
            values: dto
        });
        return dto;
    }
}