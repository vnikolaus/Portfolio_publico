import { app, BrowserWindow, ipcMain } from 'electron';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { Core } from './core.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

ipcMain.handle('calculate-taxes', (event, data) => {
    /** 
     * @type {InvestmentParams} 
     * */
    const input = data;
    const formula = (valor) => Math.pow(1 + (valor / 100), 1 / 12) - 1

    const taxaMensalSelic = formula(input.selic)
    const { totalFinal: totalSelic, totalInvestido } = Core.calculaRendimentos(input, taxaMensalSelic)

    const taxaMensalPrefixado = formula(input.juro_prefixado)
    const { totalFinal: totalPrefixado } = Core.calculaRendimentos(input, taxaMensalPrefixado)

    const taxaMensalIPCA = formula(input.ipca + input.juro_ipca)
    const { totalFinal: totalIPCA } = Core.calculaRendimentos(input, taxaMensalIPCA)

    const opcaoRentabilidadeCDB = input.opcao_rentabilidade_cdb
    const taxaMensalCDB = (opcaoRentabilidadeCDB === 'prefixado') ? formula(input.rentabilidade_cdb) : formula((input.rentabilidade_cdb / 100) * input[opcaoRentabilidadeCDB])
    const { totalFinal: totalCDB } = Core.calculaRendimentos(input, taxaMensalCDB)

    const rentabilidadeFundoDI = input.rentabilidade_di / 100
    const taxaMensalFundoDI = formula(rentabilidadeFundoDI * input.cdi)
    const { totalFinal: totalFundoDI } = Core.calculaRendimentos(input, taxaMensalFundoDI)

    const opcaoRentabilidadeLCI = input.opcao_rentabilidade_lci
    const taxaMensalLCI = (opcaoRentabilidadeLCI === 'prefixado') ? formula(input.rentabilidade_lci) : formula((input.rentabilidade_lci / 100) * input[opcaoRentabilidadeLCI])
    const { totalFinal: totalLCI }= Core.calculaRendimentos(input, taxaMensalLCI, true)
    
    const taxaMensalPoupanca = input.rentabilidade_poupanca / 100
    const { totalFinal: totalPoupanca } = Core.calculaRendimentos(input, taxaMensalPoupanca, true)
    
    const dto = {
        selic: totalSelic,
        prefixado: totalPrefixado,
        ipca: totalIPCA,
        cdb: totalCDB,
        di: totalFundoDI,
        lci: totalLCI,
        poupanca: totalPoupanca,
    }
    BrowserWindow.getFocusedWindow().webContents.send('total-invested', { totalInvestido })
    BrowserWindow.getFocusedWindow().webContents.send('calculated-data', { data: dto })
})

ipcMain.on('load-content', async (event) => {
    try {
        const url = (serie, periodo) => `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${serie}/dados/ultimos/${periodo}?formato=json`
        const [r1, r2, r3] = await Promise.all([fetch(url('432', '1')), fetch(url('433', '12')), fetch(url('195', '1'))])
        const [arrSelic, arrIpca, arrPoupanca] = await Promise.all([r1.json(), r2.json(), r3.json()])
        const taxaSelic = parseFloat(arrSelic[0]?.valor)
        const taxaCdi = taxaSelic - 0.10
        const taxaMensalPoupanca = parseFloat(arrPoupanca[0]?.valor)
        const dto = {
            selic: taxaSelic,
            cdi: taxaCdi,
            poupanca: taxaMensalPoupanca,
            ipca: 0
        }
        let somaIpca = 0
        arrIpca.forEach(el => somaIpca += parseFloat(el?.valor))
        dto.ipca = Number(somaIpca.toFixed(2))
        BrowserWindow.getFocusedWindow().webContents.send('initial-data', dto)
    } catch (error) {
        console.log("error_load-content: ", error);
    }
})

ipcMain.on('close-window', (event) => {
    BrowserWindow.getFocusedWindow()?.close()
})

ipcMain.on('minimize-window', (event) => {
    BrowserWindow.getFocusedWindow()?.minimize();
});

app.whenReady().then(async () => {
    const pathToPreload = path.join(__dirname, 'preload.js')
    const pathToHtml = path.join(__dirname, 'frontend/index.html')
    const win = new BrowserWindow({
        width: 1000,
        height: 1200,
        frame: false,
        webPreferences: {
            contextIsolation: true,
            preload: pathToPreload,
        }
    })
    win.loadFile(pathToHtml)
    // win.webContents.openDevTools()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})