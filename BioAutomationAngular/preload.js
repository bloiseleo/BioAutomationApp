const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld('electronAPI', {
  getExtraResourcesPath: () => ipcRenderer.invoke("get:extraResourcesPath"),
  uploadDocument: (workspaceName, file, refseq) => ipcRenderer.invoke("make:uploadDocument", {workspaceName, file, refseq}),
  listAllWorkspaces: () => ipcRenderer.invoke(("get:allWorkspaces"))
})
