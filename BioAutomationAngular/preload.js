const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld('electronAPI', {
  getExtraResourcesPath: () => ipcRenderer.invoke("get:extraResourcesPath"),
  uploadDocument: (workspaceName, file, refseq, proteinSequence) => ipcRenderer.invoke("make:uploadDocument", {workspaceName, file, refseq, proteinSequence}),
  listAllWorkspaces: () => ipcRenderer.invoke(("get:allWorkspaces")),
  processPredictSNPEntry: (workspaceName) => ipcRenderer.invoke("processEntry:predictSNP", {workspaceName}),
  workspaceExists: (workspaceName) => ipcRenderer.invoke("get:workspace", {workspaceName})
})
