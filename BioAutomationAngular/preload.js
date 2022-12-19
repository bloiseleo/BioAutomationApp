const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld('electronAPI', {
  getExtraResourcesPath: () => ipcRenderer.invoke("get:extraResourcesPath")
})
