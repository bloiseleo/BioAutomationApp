import { ProcessEvent } from 'src/app/interfaces/Process';
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
  @Output() onExecute: EventEmitter<ProcessEvent> = new EventEmitter<ProcessEvent>()
  @Output() onDownload: EventEmitter<ProcessEvent> = new EventEmitter<ProcessEvent>()

  handleClickExecute() {
    this.emitEvent(this.onExecute)
  }

  handleDownload() {
    this.emitEvent(this.onDownload)
  }

  private emitEvent(eventEmitter: EventEmitter<ProcessEvent>) {
    eventEmitter.emit({
      key: this.key || "",
      kind: this.kind || "",
      serviceName: this.name || ""
    })
  }

}
