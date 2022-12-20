import { ElectronAPIService } from './services/electron-api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'BioAutomationAngular';

  private electronService: ElectronAPIService;

  constructor(electronService: ElectronAPIService) {
    this.electronService = electronService;
  }

  ngOnInit(): void {
    this.testElectron();
  }

  testElectron() {
    this.electronService.getExtraResourcesPath()
    .then(res => {
      if(typeof res === "undefined") {
        console.error("You're not on Electron Enviroment")
        return;
      }
      console.log("Electron is working fine!");
      console.log(`Path to back-end application: ${res}`)
    })
  }


}
