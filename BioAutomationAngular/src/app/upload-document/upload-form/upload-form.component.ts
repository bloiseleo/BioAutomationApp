import { CreateWorkspaceService } from './../../services/create-workspace.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.css']
})
export class UploadFormComponent {

  workspaceName?: string
  refseqCode?:string
  mutationsFile?: File
  proteinSequence?: string;

  constructor(private createWorkspaceService: CreateWorkspaceService) {}

  validate(validationObject: Array<{
    name: string,
    value: string | File | undefined
  }>): boolean {
    const validations: {
      [key: string]: (value: any) => string | boolean
    } = {
      "name": (value: string | undefined): string | boolean => {
        if(typeof value === "undefined") {
          return "Você deve dar um nome com mais de 3 caracteres"
        }
        const stringWithOutSpaces = value.replace(/\s/g, "");
        if(stringWithOutSpaces.length < 3) {
          return "Você deve dar um nome com mais de 3 caracteres"
        }
        if(/[@!#$%¨&*()_+´`[{^~}\]\[\.\/\\áéíóúãõç-]/g.test(value)) {
          return "Os caracteres @!#$%¨&*()_+´`[{^~}\]\[\.\/\\áéíóúãõç- são proibidos"
        }
        return true
      },
      "refseq": (value: string | undefined): string | boolean => {
        if(typeof value === "undefined") {
          return "Você deve dar um RefSeq com mais de 3 caracteres"
        }
        const stringWithOutSpaces = value.replace(/\s/g, "");
        if(stringWithOutSpaces.length < 3) {
          return "Você deve dar um RefSeq com mais de 3 caracteres"
        }
        return true
      },
      "file": (value: File | undefined): string | boolean => {
        if(typeof value === "undefined") {
          return "Você deve fazer o upload de um arquivo XML"
        }
        if(value.type != "text/xml") {
          return "O arquivo deve ser do formato XML"
        }
        return true
      }
    }

    for(let i = 0; i < validationObject.length; i++) {
      const validation = validationObject[i]
      const validationFunction = validations[validation.name]
      const valid = validationFunction(validation.value)
      if(typeof valid === "string") {
        return this.setError(valid, `#${validation.name}`);
      }
    }

    return true;
  }

  handleSubmit($event: Event) {
    this.resetValidations()
    const validations = [
      {
        name: "name",
        value: this.workspaceName
      },
      {
        name:"refseq",
        value: this.refseqCode
      },
      {
        name: "file",
        value: this.mutationsFile
      }
    ]
    if(!this.validate(validations)) {
      return
    }
    this.createWorkspaceService.create(this.workspaceName as string, this.mutationsFile, this.refseqCode as string, this.proteinSequence as string)
    .then(res => console.log("Resultado do upload", res))

  }

  handleClickUpload() {
    const inputFile = document.querySelector("#file")
    if(!inputFile) {
      return
    }
    const realInputFile = inputFile as HTMLElement
    realInputFile.click();
  }

  handleUploadFile($event: Event) {
    const fileInput = $event.target as HTMLInputElement
    const fileList = fileInput.files as FileList;
    if(fileList.length == 0) {
      this.resetButtonUpload()
      return
    }
    const file = fileList[0]
    this.mutationsFile = file;
    this.buttonUploadText = this.mutationsFile.name;
  }

  resetButtonUpload() {
    this.buttonUploadText = "Escolha o arquivo..."
  }

  set buttonUploadText(value: string) {
    const button = document.querySelector(".upload__form__form__inputGroup--file");
    if(!button) {
      return
    }
    button.innerHTML = value
  }

  setError(message: string, selector: string) {
    const errorParagraph = document.querySelector(".upload__form__form--error")
    if(!errorParagraph) {
      return false;
    }
    errorParagraph.innerHTML = message
    const element = document.querySelector(selector) as HTMLElement
    element.focus()
    errorParagraph.classList.add("show")
    return false;
  }

  resetValidations() {
    const errorParagraph = document.querySelector(".upload__form__form--error")
    if(!errorParagraph) {
      return
    }
    errorParagraph.classList.remove("show")
  }

}
