import { Injectable } from '@angular/core';
import { ElectronAPIService } from './electron-api.service';

@Injectable({
  providedIn: 'root'
})
export class SnpsGOEntryService {

  constructor(private electronService: ElectronAPIService) {
    if(!this.electronService.isElectron()) {
      throw new Error("You should be in Electron enviroment to use this service")
    }
  }

  async process(workspaceName: string): Promise<boolean> {
    const result = this.electronService.processSnpsGoEntry(workspaceName)
    return result;
  }
}
