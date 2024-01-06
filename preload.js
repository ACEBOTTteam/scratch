const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
    //渲染程序发送到主程序
    clientSend: (...msg) => ipcRenderer.invoke('client',...msg),
    //渲染程序监听主程序串口连接状态
    onUpdateCounter: (callback) => ipcRenderer.on('serialPort', (_event, value) => callback(value)),
    //渲染程序建通主程序串口的接收数据
    onUpdateGetDate: (callback)=>ipcRenderer.on('getData',(_event,value)=>callback(value))
    // serialPortSend: (...msg) => ipcRenderer.send('serialPort', ...msg)
})