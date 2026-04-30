export class Utils {
    static toBrazilISO(date = new Date()) {
        // Converte para string no fuso de São Paulo
        const br = date.toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" });
        // "sv-SE" → padrão ISO-like: "2025-09-17 20:22:33"

        // Troca espaço por T e adiciona offset .000Z
        return br.replace(" ", "T") + ".000Z";
    }
}