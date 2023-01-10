import { ProcessAPI } from './../../interfaces/Process';
import { ElectronAPIService } from './../../services/electron-api.service';
import { Component, OnInit } from '@angular/core';
import {Workspace, Workspaces} from 'src/app/interfaces/Workspace';
import { PredictSNPEntryService } from 'src/app/services/predict-snpentry.service';
import Process, { ProcessEvent } from 'src/app/interfaces/Process';
import { AlertService } from 'src/app/services/alert.service';
import { LoadingService } from 'src/app/services/loading.service';
import { PredictSNPOutServiceService } from 'src/app/services/predict-snpout-service.service';

function identify<T>(value: any): T {
  return value as T;
}

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit {

  workspaces: Workspaces = {}
  workspacesNames: string[] = []
  entryServices: Array<Process> = []
  outServices: Array<Process> = []
  showEntry: boolean = true;
  showOut: boolean = false;
  workspaceNameSelected?: string;
  workspaceSelected?: Workspace;

  constructor(
    private alertService: AlertService,
    private loadingService: LoadingService,
    private electronService: ElectronAPIService,
    public predictSNPEntry: PredictSNPEntryService,
    public predictSNPOut: PredictSNPOutServiceService) {
      this.entryServices.push({
        name: "Predict SNP",
        key: "predictSNP",
        description: "Gera a entrada necessária para utilizar o Predict SNP de acordo com o site: https://loschmidt.chemi.muni.cz/predictsnp1/",
        kind: "entry",
        done: false
      })
      this.outServices.push({
        name: "Predict SNP",
        key: "predictSNP",
        description: "Gera a saída necessária para utilizar o Predict SNP de acordo com o site: https://loschmidt.chemi.muni.cz/predictsnp1/",
        kind: "out",
        done: false
      })
  }

  get executeOptions(): ProcessAPI {
    return {
      "entry": {
        "predictSNP": (workspace: Workspace) => this.predictSNPEntry.process(workspace.name)
      },
      "out": {
        "predictSNP": (workspace: Workspace, resultFile: File) => this.predictSNPOut.process(workspace, resultFile)
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

  handleExecute($event: ProcessEvent) {
    if(this.workspaceNameSelected === undefined) {
      this.setErrorMessage("Um workspace deve ser escolhido antes de executar as funções existentes.")
      throw new Error("Workspace must be selected to execute functions")
    }
    if(this.workspaceSelected === undefined) {
      this.setErrorMessage("Um workspace deve ser escolhido antes de executar as funções existentes.")
      throw new Error("Workspace must be selected to execute functions")
    }

    const {key, kind, serviceName, resultFile} = $event

    if(kind == "entry") {
      return this.executeEntry(kind, key, serviceName)
    } else {
      return this.executeOut(kind, key, identify(resultFile), serviceName);
    }

  }

  handleDownload($event: ProcessEvent) {
    if(this.workspaceNameSelected === undefined) {
      this.setErrorMessage("Um workspace deve ser escolhido antes de executar as funções existentes.")
      throw new Error("Workspace must be selected to execute functions")
    }
    if(this.workspaceSelected === undefined) {
      this.setErrorMessage("Um workspace deve ser escolhido antes de executar as funções existentes.")
      throw new Error("Workspace must be selected to execute functions")
    }
    const workspace = this.workspaceSelected as Workspace;
    const {key, kind, serviceName} = $event
    const pathToFile = workspace[kind][key]['path_to_file'] as string;
    this.downloadFile(pathToFile, `${serviceName}_${kind}`)
  }

  handleWorkspaceChanged() {
    const workspace = this.workspaces[this.workspaceNameSelected as string];

    if(typeof workspace === "undefined") {
      throw new Error("Workpsace selected is not valid")
    }

    this.workspaceSelected = workspace;
    this.atualizeListOfServices()
  }

  handleClickKindProcess($event: Event) {
    const elementClicked = $event.target;

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

  private downloadFile(path: string, filename: string) {
    const link = document.createElement('a');
    link.setAttribute("download", filename);
    link.setAttribute('href', path);
    link.click()
  }

  private executeEntry(kind: string, key: string, serviceName: string) {
    const options = this.executeOptions;
    const optionsWanted = options[kind];
    const workspaceName = this.workspaceNameSelected as string;
    const workspace = this.workspaceSelected as Workspace;
    if(!Object.keys(optionsWanted).includes(key)) {
      throw new Error(`Kind => ${kind} does not have the service ${key}`)
    }
    const serviceToExecute = optionsWanted[key];
    const timestart = Date.now();
    const icons = document.querySelectorAll(".process__main--icon") as NodeListOf<HTMLElement>;
    this.loadingService.startLoading(icons)
    serviceToExecute(workspace)
    .then((success: boolean) => {
      if(!success) {
        this.setErrorMessage("Houve um erro interno ao processar esse serviço.")
        console.error("There was an error while processing this service: ", kind, key, serviceName)
        return;
      }
      const timeEnd = Date.now();
      const timeSpent = (timeEnd - timestart)/1000;
      const message = this.createMessageDone(serviceName, timeSpent)
      this.atualizeWorkspaceServiceState(workspaceName, kind, key)
      this.alertService.show(message.title, message.message)
      this.loadingService.stopLoading()
    })
  }

  private executeOut(kind: string, key: string, resultFile: File, serviceName: string) {
    const options = this.executeOptions;
    const optionsWanted = options[kind];
    const workspaceName = this.workspaceNameSelected as string;
    const workspace = this.workspaceSelected as Workspace;
    if(!Object.keys(optionsWanted).includes(key)) {
      throw new Error(`Kind => ${kind} does not have the service ${key}`)
    }
    const serviceToExecute = optionsWanted[key];
    const timestart = Date.now();
    const icons = document.querySelectorAll(".process__main--icon") as NodeListOf<HTMLElement>;
    this.loadingService.startLoading(icons)
    serviceToExecute(workspace, resultFile)
    .then((success: boolean) => {
      if(!success) {
        this.setErrorMessage("Houve um erro interno ao processar esse serviço.")
        console.error("There was an error while processing this service: ", kind, key, serviceName)
        return;
      }
      const timeEnd = Date.now();
      const timeSpent = (timeEnd - timestart)/1000;
      const message = this.createMessageDone(serviceName, timeSpent)
      this.atualizeWorkspaceServiceState(workspaceName, kind, key)
      this.alertService.show(message.title, message.message)
      this.loadingService.stopLoading()
    })

  }

  private setErrorMessage(mensagem: string) {
    this.alertService.show("Erro", mensagem)
  }

  private createMessageDone(title: string, timeOfDuration: number) {
    return {
      title: title,
      message: `O serviço foi executado em ${timeOfDuration} segundos e já está disponível para download`
    }
  }

  private atualizeWorkspaceServiceState(workspaceName: string, serviceKind: string, serviceName: string) {
    if(this.workspaceSelected === undefined) {
      throw new Error("Workpsace was not selected.")
    }
    if(this.workspaceSelected.name !== workspaceName) {
      throw new Error("Workspace Name passed is different from workspace selected");
    }
    const newWorkspaceSelected = {...this.workspaceSelected};
    newWorkspaceSelected[serviceKind][serviceName]['done'] = true;
    this.workspaceSelected = newWorkspaceSelected;
    this.workspaces[workspaceName] = {...this.workspaceSelected};
    this.atualizeListOfServices();
  }

  private atualizeListOfServices() {
    this.entryServices = this.entryServices.map(entry => {
      const workspaceSelected = this.workspaceSelected as Workspace;
      const cloneEntry = {...entry}
      cloneEntry.done = workspaceSelected[entry.kind][entry.key]['done']
      return cloneEntry;
    })
    this.outServices = this.outServices.map(out => {
      const workspaceSelected = this.workspaceSelected as Workspace;
      const cloneOut = {...out}
      cloneOut.done = workspaceSelected[out.kind][out.key]['done']
      return cloneOut;
    })
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
