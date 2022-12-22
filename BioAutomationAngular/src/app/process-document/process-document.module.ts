import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcessDocumentRoutingModule } from './process-document-routing.module';
import { WorkspaceComponent } from './workspace/workspace.component';


@NgModule({
  declarations: [
    WorkspaceComponent
  ],
  imports: [
    CommonModule,
    ProcessDocumentRoutingModule
  ]
})
export class ProcessDocumentModule { }
