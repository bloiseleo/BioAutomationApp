import { ElectronAPIService } from './electron-api.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PredictSNPEntryService {

  constructor(private electronService: ElectronAPIService) {
    if(!this.electronService.isElectron()) {
      throw new Error("You should be in Electron enviroment to use this service")
    }
  }

  async process(workspaceName: string): Promise<boolean> {
    const result = this.electronService.processPredictSNPEntry(workspaceName)
    return result;
  }
}
