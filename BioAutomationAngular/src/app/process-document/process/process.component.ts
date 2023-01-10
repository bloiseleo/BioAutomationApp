import { ProcessEvent } from 'src/app/interfaces/Process';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.css']
})
export class ProcessComponent {

  @Input() name?: string;
  @Input() key?: string;
  @Input() kind?: string;
  @Input() description?: string;
  @Input() processDone?: boolean;
  @Output() onExecute: EventEmitter<ProcessEvent> = new EventEmitter<ProcessEvent>()
  @Output() onDownload: EventEmitter<ProcessEvent> = new EventEmitter<ProcessEvent>()
  private resultFile?: File
  fileUploaded: boolean = false;

  constructor(
    private alertService: AlertService
  ) {
    this.alertService = alertService;
  }

  handleClickExecute() {
    if(this.kind == "entry") {
      return this.emitEventEntry(this.onExecute)
    } else {
      return this.emitEventOut(this.onExecute)
    }

  }

  handleDownload() {
    this.emitEventEntry(this.onDownload)
  }

  executeUploadFile() {
    const inputFile = document.querySelector("#resultFile") as HTMLElement;
    if(!inputFile) {
      throw new Error("#resultFile selector was not found")
    }
    inputFile.click();
  }

  handleUploadFile($event: Event) {
    const fileInput = $event.target as HTMLInputElement
    const fileList = fileInput.files as FileList;
    if(fileList.length == 0) {
      this.alertService.show("Upload Arquivo Resultante", "Você deve fazer o upload de um arquivo contendo os resultados do algoritmo correspondente.")
      this.fileUploaded = false;
      return;
    }
    const file = fileList[0];
    this.resultFile = file;
    this.fileUploaded = true;
  }

  private emitEventEntry(eventEmitter: EventEmitter<ProcessEvent>) {
    eventEmitter.emit({
      key: this.key || "",
      kind: this.kind || "",
      serviceName: this.name || ""
    })
  }

  private emitEventOut(eventEmitter: EventEmitter<ProcessEvent>) {
    eventEmitter.emit({
      key: this.key || "",
      kind: this.kind || "",
      serviceName: this.name || "",
      resultFile: this.resultFile
    })
  }

}
