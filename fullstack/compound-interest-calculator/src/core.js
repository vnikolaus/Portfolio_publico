/**
 * @typedef {Object} InvestmentParams
 * @property {number} investimento_inicial
 * @property {number | null} aporte_mensal
 * @property {number} periodo
 * @property {number} selic
 * @property {number} cdi
 * @property {number} ipca
 * @property {number | null} juro_prefixado
 * @property {number | null} juro_ipca
 * @property {number} rentabilidade_cdb
 * @property {number} rentabilidade_di
 * @property {number} rentabilidade_lci
 * @property {number} rentabilidade_poupanca
 * @property {string} opcao_rentabilidade_cdb
 * @property {string} opcao_rentabilidade_lci
 */

export class Core {
    /**
     * @param {number} valor
     * @param {number} periodo
     * @returns {number}
     */
    static #descontaIR(valor, periodo) {
        periodo = Number(periodo)
        if (periodo > 24) {
            return valor * (1 - 0.15)
        } else if (periodo > 12) {
            return valor * (1 - 0.175)
        } else if (periodo > 6) {
            return valor * (1 - 0.20)
        } else {
            return valor * (1 - 0.225)
        }
    }

    /**
     * @param {InvestmentParams} input
     * @param {number} taxaMensal
     * @returns {{ totalFinal: number, totalInvestido: number }}
     */
    static calculaRendimentos(input, taxaMensal, isento = false) {
        let valorTotal = +input.investimento_inicial
        let totalInvestido = +input.investimento_inicial
        const periodo = Number(input.periodo)
        const aporteMensal = Number(input.aporte_mensal) || 0
        let mes = 0
        while (mes++ < periodo) {
            valorTotal += aporteMensal
            totalInvestido += aporteMensal
            valorTotal *= (1 + taxaMensal)
        }
        const totalRendimentos = valorTotal - totalInvestido
        const rendimentoLiquido = isento ? totalRendimentos : this.#descontaIR(totalRendimentos, periodo)
        const totalFinal = Math.round((totalInvestido + rendimentoLiquido) * 100) / 100
        return {
            totalFinal,
            totalInvestido
        }
    }
}