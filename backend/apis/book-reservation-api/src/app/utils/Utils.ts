export class Utils {
    static now() {
        return new Date();
    }

    static toBrazilDateTime(date = new Date()) {
        return new Intl.DateTimeFormat("pt-BR", {
            timeZone: "America/Sao_Paulo",
            dateStyle: "short",
            timeStyle: "medium",
        }).format(date);
    }
}