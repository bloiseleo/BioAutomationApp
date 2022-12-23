/**
 * This interface must have all functions determinated on preload.js
 */

export interface ElectronWindow extends Window {
  electronAPI: {
    getExtraResourcesPath: () => Promise<string>,
    uploadDocument: (workspaceName: string, file: string, refseq: string, proteinSequence: string, proteinHeader: string) => Promise<boolean>,
    listAllWorkspaces: () => Promise<string | boolean>,
    processPredictSNPEntry: (workspaceName: string) => Promise<boolean>,
    workspaceExists: (workspaceName: string) => Promise<boolean>
  }
}
