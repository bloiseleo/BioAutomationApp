import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: "uploadDocument", loadChildren: () => import("./upload-document/upload-document.module").then(m => m.UploadDocumentModule) },
  {path: "processDocument", loadChildren: () => import('./process-document/process-document.module').then(m => m.ProcessDocumentModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
