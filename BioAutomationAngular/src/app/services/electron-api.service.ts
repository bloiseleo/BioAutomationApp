import { Injectable } from '@angular/core';
import { ElectronWindow } from '../interfaces/ElectronWindow'


function _window() {
  return window as unknown;
}
/**
 *This class encapsulates all preload functions and makes the available to Angular in a Service Way.
 */
@Injectable({
  providedIn: 'root'
})
export class ElectronAPIService {

  private window: unknown;
  private _window?: ElectronWindow;

  constructor() {
    this.window = _window();
    if(this.isElectron()) {
      this._window = _window() as ElectronWindow;
    } else {
      console.warn("You are not in Electron Enviroment. Then, some functions won't work")
    }
  }

  async workspaceExists(workspaceName: string): Promise<boolean> {
    const result = await this._window?.electronAPI.workspaceExists(workspaceName)
    return Boolean(result)
  }

  async getExtraResourcesPath(): Promise<string | undefined> {
    const extraResourcesPath = await this._window?.electronAPI.getExtraResourcesPath()
    return extraResourcesPath
  }

  async uploadDocument(workspaceName: string, file: string, refseq: string, proteinSequence: string, proteinHeader: string): Promise<boolean> {
    try {
      const result = await this._window?.electronAPI.uploadDocument(workspaceName, file, refseq, proteinSequence, proteinHeader)
      return Boolean(result);
    } catch(error: unknown) {
      console.error(error)
      return false;
    }
  }

  async listAllWorkspaces(): Promise<string | boolean> {
    try {
      const result = await this._window?.electronAPI.listAllWorkspaces()
      if(typeof result !== "string") {
        return false;
      }

      return result
    } catch(error: unknown) {
      console.error(error)
      return false;
    }
  }

  async processPredictSNPEntry(workspaceName: string): Promise<boolean> {
    try {
      const result = await this._window?.electronAPI.processPredictSNPEntry(workspaceName)
      if(typeof result === "undefined") {
        return false;
      }
      return result
    } catch(error: unknown) {
      console.error(error)
      return false;
    }
  }

  async processPredictSNPOut(workspaceName: string, resultFile: string): Promise<boolean> {
    try {
      const result = await this._window?.electronAPI.processPredictSNPOut(workspaceName, resultFile)
      if(typeof result === "undefined") {
        return false;
      }
      return result
    } catch(error: unknown) {
      console.error(error)
      return false;
    }
  }

  isElectron(): boolean {
    return (Object.keys(window).includes("electronAPI"))
  }


}
