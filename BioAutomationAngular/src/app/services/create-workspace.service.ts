import { ElectronAPIService } from './electron-api.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CreateWorkspaceService {

  constructor(private electronService: ElectronAPIService) {
    if(!this.electronService.isElectron()) {
      throw new Error("You should be in Electron enviroment to use this service")
    }
  }

  async checkIfWorkspaceExists(workspaceName: string): Promise<boolean> {
    return this.electronService.workspaceExists(workspaceName)
  }

  async create(workspaceName: string, file: any, refseq: string, proteinSequence: string, proteinHeader: string): Promise<boolean> {
    const filepath = file.path as string
    const result = await this.electronService.uploadDocument(workspaceName, filepath, refseq, proteinSequence, proteinHeader)
    return result;
  }
}
