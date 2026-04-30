const { contextBridge, ipcRenderer } = require('electron');

Document.prototype.addValue = function(id, value) {
    this.getElementById(id).value = value
}

Document.prototype.addContent = function(id, value) {
    this.getElementById(id).textContent = value
}

contextBridge.exposeInMainWorld('electronAPI', {
    closeWindow: () => ipcRenderer.send('close-window'),
    minimizeWindow: () => ipcRenderer.send('minimize-window'),
    loadContent: () => ipcRenderer.send('load-content'),
    calculateTaxes: (dto) => {
        ipcRenderer.invoke('calculate-taxes', dto)
    }
})

ipcRenderer.on(`initial-data`, (event, data) => {
    document.addValue('selic', data.selic.toFixed(2))
    document.addValue('cdi', data.cdi.toFixed(2))
    document.addValue('ipca', data.ipca.toFixed(2))
    document.addValue('juro-prefixado', (data.selic - 1).toFixed(2))
    document.addValue('juro-ipca', (data.ipca + 1).toFixed(2))
    document.addValue('cdb', '100.00')
    document.addValue('di', '98.50')
    document.addValue('lci', '85.00')
    document.addValue('poupanca', data.poupanca)
})

ipcRenderer.on(`calculated-data`, (event, data) => {
    window.dispatchEvent(new CustomEvent('graphic-data', { detail: data }))
})

ipcRenderer.on(`total-invested`, (event, data) => {
    document.addContent('valor-investido', Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.totalInvestido))
})