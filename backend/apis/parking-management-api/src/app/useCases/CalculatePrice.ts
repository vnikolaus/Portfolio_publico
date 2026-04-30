export class CalculatePrice {
    private readonly GRACE_PERIOD_MIN = 15;
    private readonly FIRST_HOUR       = 12;
    private readonly EXTRA_HOUR       = 3;


    exec(checkin: number, checkout: number) {
        if (checkout <= checkin) return 0;

        // diferença em minutos
        const diffMin = Math.ceil((checkout - checkin) / (1000 * 60));

        // até a tolerância não cobra
        if (diffMin <= this.GRACE_PERIOD_MIN) return 0;

        // até 60 minutos cobra só a primeira hora
        if (diffMin <= 60) return this.FIRST_HOUR;

        // passou de 1h → calcula extras
        const horasExtras = Math.ceil((diffMin - 60) / 60); // cada fração vira 1h
        return this.FIRST_HOUR + (horasExtras * this.EXTRA_HOUR);
    }
}