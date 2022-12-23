import { ValidationService } from './../../services/validation.service';
import { CreateWorkspaceService } from './../../services/create-workspace.service';
import { Component } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';

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

  constructor(private createWorkspaceService: CreateWorkspaceService, private loadingService: LoadingService,
    private validationService: ValidationService) {}

  get validations() {
    const validations: {
      value: any,
      validationFunction: (...params: any) => {
        valid: boolean,
        message: string
      }
    }[] = [
      {
        value: this.workspaceName,
        validationFunction: (value: string) => {
          if(typeof value === "undefined") {
            return {
              message: "Você deve dar um nome com mais de 3 caracteres",
              valid: false
            }
          }
          const stringWithOutSpaces = value.replace(/\s/g, "");
          if(stringWithOutSpaces.length < 3) {
            return {
              message: "Você deve dar um nome com mais de 3 caracteres",
              valid: false
            }
          }
          if(/[@!#$%¨&*()_+´`[{^~}\]\[\.\/\\áéíóúãõç-]/g.test(value)) {
            return  {
              message: "Os caracteres @!#$%¨&*()_+´`[{^~}\]\[\.\/\\áéíóúãõç- são proibidos",
              valid: false
            }
          }
          return  {
            message: "",
            valid: true
          }
        }
      },
      {
        value: this.refseqCode,
        validationFunction: (value: string) => {
          if(typeof value === "undefined") {
            return {
              message: "Você deve dar um RefSeq com mais de 3 caracteres",
              valid: false
            }
          }
          const stringWithOutSpaces = value.replace(/\s/g, "");
          if(stringWithOutSpaces.length < 3) {
            return {
              message: "Você deve dar um RefSeq com mais de 3 caracteres",
              valid: false
            }
          }
          return {
            message: "",
            valid: true
          }
        }
      },
      {
        value: this.mutationsFile,
        validationFunction: (value: File) => {
          if(typeof value === "undefined") {
            return {
              message: "Você deve fazer o upload de um arquivo XML",
              valid: false
            }
          }
          if(value.type != "text/xml") {
            return {
              message: "O arquivo deve ser do formato XML",
              valid: false
            }
          }
          return  {
            message: "",
            valid: true
          }
        }
      },
      {
        value: this.proteinSequence,
        validationFunction: (value: string) => {
          if(typeof value === "undefined") {
            return {
              message: "Você deve fornecer a sequência da proteína desejada COMPLETA.",
              valid: false
            }
          }
          if(value.length < 10) {
            return {
              message: "A sequência de aminoácidos da proteína deve conter mais que dez caracteres",
              valid: false
            }
          }
          return  {
            message: "",
            valid: true
          }
        }
      }
    ]
    return validations;
  }

  handleSubmit($event: Event) {
    console.log(this.proteinSequence?.replace(/\s/g, ""))
    const form = $event.target as HTMLElement;
    const inputSubmit = form.querySelector(`.upload__form__form input[type="submit"]`) as HTMLElement;
    this.loadingService.startLoading(inputSubmit)
    const validations = this.validations;
    const errorParagraph = document.querySelector(".upload__form__form--error") as HTMLElement
    if(!errorParagraph) {
      throw new Error("Parágrafo de erro não foi recuperado")
    }
    if(!this.validationService.validate(validations, errorParagraph)) {
      this.loadingService.stopLoading()
      return
    }

    this.createWorkspaceService.checkIfWorkspaceExists(this.workspaceName as string)
    .then(exists => {
      if(exists) {
        this.loadingService.stopLoading()
        this.setError("Esse Workspace já existe.", "#name")
        return;
      }
      this.createWorkspaceService.create(this.workspaceName as string, this.mutationsFile, this.refseqCode as string, this.proteinSequence as string)
      .then(success => {
        this.loadingService.stopLoading()
        if(!success) {
          this.setError("Houve um erro ao executar o Upload do Arquivo.", "#name")
        }
      })
    })
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

  handleChange() {
    this.proteinSequence = this.proteinSequence?.replace(/\s/g, "")
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
    setTimeout(() => {
      errorParagraph.classList.remove("show")
    }, 5000)
    return false;
  }

}
