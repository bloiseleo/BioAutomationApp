import { Workspace } from 'src/app/interfaces/Workspace';
import Process from 'src/app/interfaces/Process';
import { Component, Input, Output, EventEmitter } from '@angular/core';

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
  @Output() onExecute: EventEmitter<{
    key: string,
    kind: string,
    serviceName: string
  }> = new EventEmitter<{
    key: string,
    kind: string,
    serviceName: string
  }>()
  @Output() onDownload: EventEmitter<{
    key: string,
    kind: string,
    serviceName: string
  }> = new EventEmitter<
  {
    key: string,
    kind: string,
    serviceName: string
  }
  >()

  handleClickExecute() {
    this.onExecute.emit({
      key: this.key || "",
      kind: this.kind || "",
      serviceName: this.name || ""
    })
  }

  handleDownload() {
    this.onDownload.emit({
      key: this.key || "",
      kind: this.kind || "",
      serviceName: this.name || ""
    })
  }

}
