import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcessDocumentRoutingModule } from './process-document-routing.module';
import { WorkspaceComponent } from './workspace/workspace.component';
import { ProcessComponent } from './process/process.component';


@NgModule({
  declarations: [
    WorkspaceComponent,
    ProcessComponent
  ],
  imports: [
    CommonModule,
    ProcessDocumentRoutingModule,
    FormsModule
  ]
})
export class ProcessDocumentModule { }
