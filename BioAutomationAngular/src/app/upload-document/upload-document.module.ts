import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploadDocumentRoutingModule } from './upload-document-routing.module';
import { UploadFormComponent } from './upload-form/upload-form.component';


@NgModule({
  declarations: [
    UploadFormComponent
  ],
  imports: [
    CommonModule,
    UploadDocumentRoutingModule
  ]
})
export class UploadDocumentModule { }
