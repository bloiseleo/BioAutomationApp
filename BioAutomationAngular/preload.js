const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld('electronAPI', {
  getExtraResourcesPath: () => ipcRenderer.invoke("get:extraResourcesPath"),
  uploadDocument: (workspaceName, file, refseq, proteinSequence, proteinHeader) =>
    ipcRenderer.invoke("make:uploadDocument", {workspaceName, file, refseq, proteinSequence, proteinHeader}),
  listAllWorkspaces: () => ipcRenderer.invoke(("get:allWorkspaces")),
  processPredictSNPEntry: (workspaceName) => ipcRenderer.invoke("processEntry:predictSNP", {workspaceName}),
  workspaceExists: (workspaceName) => ipcRenderer.invoke("get:workspace", {workspaceName}),
  processPredictSNPOut: (workspaceName, resultFile) => ipcRenderer.invoke("processOut:predictSNP", {
    workspaceName, resultFile
  })
})
