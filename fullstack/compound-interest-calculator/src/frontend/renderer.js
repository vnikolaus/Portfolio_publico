/**
 * @typedef {{ loadContent: Function, calculateTaxes: Function }} ElectronAPI
 * @typedef {{ electronAPI: ElectronAPI } & window} MainWindow
 * @type {MainWindow}
 */
const MAIN_WINDOW = window

MAIN_WINDOW.addEventListener('DOMContentLoaded', (e) => {
    MAIN_WINDOW.electronAPI.loadContent()

    MAIN_WINDOW.addEventListener('graphic-data', (e) => {
        const { data } = e.detail;
        const orderedArray = Object.entries(data).map(([ key, value ]) => ({ key, value })).sort((a, b) => b.value - a.value)
        Utils.showGraphic(data, orderedArray);
    });

    document.getElementById('calcular').addEventListener('click', (e) => {
        const _num = (id) => +document.getElementById(id).value || Utils.stringToNumber(document.getElementById(id).value)
        const investimentoInicial = Utils.stringToNumber(document.getElementById('investimento-inicial').value)
        const periodo = _num('periodo')
        if (!investimentoInicial) return Utils.showError('Preencha o valor do investimento inicial para realizar o cálculo.')
        if (!periodo) return Utils.showError('Preencha o periodo do investimento para realizar o cálculo.')
        const dto = {
            investimento_inicial: investimentoInicial,
            aporte_mensal: _num('aporte-mensal'),
            periodo,
            selic: _num('selic'),
            cdi: _num('cdi'),
            ipca: _num('ipca'),
            juro_prefixado: _num('juro-prefixado'),
            juro_ipca: _num('juro-ipca'),
            rentabilidade_cdb: _num('cdb'),
            rentabilidade_di: _num('di'),
            rentabilidade_lci: _num('lci'),
            rentabilidade_poupanca: _num('poupanca'),
            opcao_rentabilidade_cdb: document.getElementById('cdb-base').value || '',
            opcao_rentabilidade_lci: document.getElementById('lci-base').value || '',
        }
        if (['selic', 'cdi', 'ipca'].some(key => isNaN(dto[key]))) return Utils.showError('Preencha os valores dos índices (Selic, CDI, IPCA) para realizar o cálculo.')
        MAIN_WINDOW.electronAPI.calculateTaxes(dto)
    })

    document.getElementById('restaurar').addEventListener('click', (e) => {
        document.location.reload()
    });
})


/** @Utils */

class Utils {
    /**
     * @param {string} message
     * @returns {void}
     */
    static showError(message = 'Preencha os campos corretamente.') {
        const errorDiv = document.getElementById('error-message');
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
        setTimeout(() => {
            errorDiv.classList.add('hidden');
        }, 3000);
    }

    /**
     * @param {string} value
     * @returns {number | null}
     */
    static stringToNumber(value) {
        return value ? parseFloat(value?.replace(/[.]/g, '').replace(',', '.').trim()) : null
    }

    /**
     * @param {number} value
     * @returns {string}
     */
    static formatBRL(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value)
    }

    /**
     * @param {Element} target
     * @returns {void}
     */
    static maskNumber(target) {
        if (!target.value) return
        let value = target.value.replace(/\D/g, '');
        if (!value) {
            target.value = ''
            return
        }
        target.value = value;
    }

    /**
     * @param {Element} target
     * @returns {void}
     */
    static maskValue(target) {
        if (!target.value) return
        let value = target.value.replace(/\D/g, '');
        if (!value) {
            target.value = ''
            return
        }
        const number = parseInt(value, 10);
        const formattedValue = Intl.NumberFormat('pt-BR', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(number / 100)
        target.value = formattedValue;
    }

    /**
     * @param {Element} target
     * @returns {void}
     */
    static maskPoupanca(target) {
        let valor = target.value.replace(/\D/g, '')
        if (valor.length === 0) {
            target.value = ''
            return
        }
        if (valor.length === 1) {
            target.value = '0,' + valor
            return
        }
        const inteiro = valor.slice(0, 1)
        const decimal = valor.slice(1, 6)
        target.value = `${inteiro},${decimal}`
    }

    /**
     * @typedef {{ selic: number, prefixado: number, ipca: number, cdb: number, di: number, lci: number, poupanca: number }} GraphicDTO
     * @param {GraphicDTO} dto
     * @param {Array<{ key: string, value: number }>} graphicData
     * @returns {void}
     */
    static showGraphic(dto, graphicData) {
        const chartAlreadyExists = Chart.getChart('grafico-rendimento');
        if (chartAlreadyExists) chartAlreadyExists.destroy();
        const _dataset = (indice) => {
            const indices = new Map()
            indices.set('selic', 'Selic')
            indices.set('prefixado', 'Pré-fixado')
            indices.set('ipca', 'IPCA+')
            indices.set('cdb', 'CDB')
            indices.set('di', 'Fundo DI')
            indices.set('lci', 'LCI/LCA')
            indices.set('poupanca', 'Poupança')
            const indiceEscolhido = indices.get(indice)
            const rentabilidadeIndice = dto[indice]
            return {
                label: indiceEscolhido,
                data: [rentabilidadeIndice],
                borderColor: '#536B78',
                backgroundColor: 'rgba(83, 107, 120, 0.3)',
                borderWidth: 2,
                datalabels: {
                    anchor: 'end',
                    align: 'left',
                    clip: true,
                    formatter: () => `${indiceEscolhido} - ${Utils.formatBRL(rentabilidadeIndice)}`,
                    color: 'black',
                    font: {
                        weight: 'bold'
                    },
                }
            }
        }
        const ctx = document.getElementById('grafico-rendimento');
        const datasets = graphicData.map(el => (_dataset(el.key)))
        const config = {
            type: 'bar',
            data: {
                labels: [''],
                datasets
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            font: {
                                weight: 'bold',
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const value = context.parsed.x || 0
                                return `Valor líquido: ${Utils.formatBRL(value)}`
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: false,
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Rentabilidade',
                            font: {
                                weight: 'bold',
                                size: 16
                            },
                            color: '#536B78'
                        }
                    }
                }
            },
            plugins: [ChartDataLabels]
        };
        document.querySelector('.chart-container').removeAttribute('hidden')
        new Chart(ctx, config);
    }
}