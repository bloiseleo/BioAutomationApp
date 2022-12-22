import { ElectronAPIService } from './../../services/electron-api.service';
import { Component, OnInit } from '@angular/core';
import {Workspaces} from 'src/app/interfaces/Workspace';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit {

  workspaces?: Workspaces

  constructor(private electronService: ElectronAPIService) {}

  loadAllWorkspaces() {
    this.electronService.listAllWorkspaces()
    .then(res => {
      if(typeof res !== "string") {
        console.error("There was an error while loading all workspaces")
        return;
      }
      const workspaces = JSON.parse(res) as Workspaces
      this.workspaces = workspaces;
    })
  }

  ngOnInit(): void {
    this.loadAllWorkspaces()
  }

}
