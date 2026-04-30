export class Utils {
    static toBrazilISO(date = new Date()) {
        const br = date.toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" });
        return br.replace(" ", "T") + ".000Z";
    }
}