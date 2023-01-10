import { Injectable } from '@angular/core';
import { Workspace } from 'src/app/interfaces/Workspace';
import { ElectronAPIService } from './electron-api.service';

@Injectable({
  providedIn: 'root'
})
export class PredictSNPOutServiceService {

  constructor(private electronService: ElectronAPIService) {
    if(!this.electronService.isElectron()) {
      throw new Error("You should be in Electron enviroment to use this service")
    }
  }

  async process(workspace: Workspace, resultFile: any): Promise<boolean> {
    const name = workspace.name;
    const filepath = resultFile.path as string
    return this.electronService.processPredictSNPOut(name, filepath)
  }
}
