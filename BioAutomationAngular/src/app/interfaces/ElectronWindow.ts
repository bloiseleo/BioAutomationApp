/**
 * This interface must have all functions determinated on preload.js
 */

export interface ElectronWindow extends Window {
  electronAPI: {
    getExtraResourcesPath: () => Promise<string>,
    uploadDocument: (workspaceName: string, file: string, refseq: string) => Promise<boolean>,
    listAllWorkspaces: () => Promise<string | boolean>
  }
}
