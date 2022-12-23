import { ElectronAPIService } from './../../services/electron-api.service';
import { Component, OnInit } from '@angular/core';
import {Workspace, Workspaces} from 'src/app/interfaces/Workspace';
import { PredictSNPEntryService } from 'src/app/services/predict-snpentry.service';
import Process from 'src/app/interfaces/Process';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit {

  workspaces: Workspaces = {}
  workspacesNames: string[] = []
  entryServices: Array<Process> = []
  showEntry: boolean = true;
  showOut: boolean = false;
  workspaceNameSelected?: string;
  workspaceSelected?: Workspace;

  constructor(private electronService: ElectronAPIService,
    public predictSNPEntry: PredictSNPEntryService) {
      this.entryServices.push({
        name: "Predict SNP",
        key: "predictSNP",
        description: "Descrição do Serviço",
        kind: "entry",
        done: this.workspaceSelected?.entry.predictSNP.done || false
      })
  }

  get executeOptions() {
    return {
      "entry": {
        "predictSNP": (workspace: Workspace) => this.predictSNPEntry.process(workspace.name)
      }

    }
  }

  loadAllWorkspaces() {
    this.electronService.listAllWorkspaces()
    .then(res => {
      if(typeof res !== "string") {
        console.error("There was an error while loading all workspaces")
        return;
      }
      const listWorkspaces = JSON.parse(res) as Array<Workspace>
      for(let workspace of listWorkspaces) {
        this.workspaces[workspace.name] = workspace
        this.workspacesNames.push(workspace.name)
      }
    })
  }

  handleExecute($event:{
    key: string,
    kind: string
  } ) {
    const {key, kind} = $event
    const options = this.executeOptions as any;
    const optionsWanted: any = options[kind];
    if(!Object.keys(optionsWanted).includes(key)) {
      console.error("Serviço inválido")
      return;
    }
    const serviceToExecute = optionsWanted[key];
    serviceToExecute(this.workspaceSelected)
    .then((res: any) => {
      console.log(res)
    })
  }

  handleWorkspaceChanged() {
    this.workspaceSelected = this.workspaces[this.workspaceNameSelected as string]
  }

  handleClickKindProcess($event: Event) {
    const elementClicked = $event.target;
    console.log(this.workspaceSelected)
    if(elementClicked === null) {
      return
    }

    const htmlElement = elementClicked as Element;

    if(htmlElement.tagName !== "LI") {
      return
    }

    const itemList = htmlElement as HTMLElement;

    if(itemList.classList.contains('active')) {
      return;
    }

    const list = itemList.parentElement as HTMLElement;
    this.resetDataSetOfList(list)
    this.activeListeItem(itemList)
    this.toggleEntryOut()

  }

  private resetDataSetOfList(list: HTMLElement) {
    for(let i = 0; i < list.children.length; i++) {
      const item = list.children.item(i) as HTMLElement;
      this.disableListItem(item)
    }
  }

  private disableListItem(item: HTMLElement) {
    item.classList.remove("active");
  }

  private activeListeItem(item: HTMLElement) {
    item.classList.add("active")
  }

  private toggleEntryOut() {
    this.showEntry = !this.showEntry;
    this.showOut = !this.showOut;
  }

  ngOnInit(): void {
    this.loadAllWorkspaces()
  }

}
