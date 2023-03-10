import { ValidationList } from './../../interfaces/Validation';
import { ValidationService } from './../../services/validation.service';
import { CreateWorkspaceService } from './../../services/create-workspace.service';
import { Component } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.css']
})
export class UploadFormComponent {

  workspaceName?: string
  refseqCode?:string
  mutationsFile?: File
  proteinHeader?: string;
  proteinSequence?: string;

  constructor(
    private createWorkspaceService: CreateWorkspaceService,
    private loadingService: LoadingService,
    private validationService: ValidationService,
    private alertService: AlertService) {}

  get validations(): ValidationList {
    const validations: ValidationList = [
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
      },
      {
        value: this.proteinHeader,
        validationFunction: (value: string) => {

          if(typeof value !== "string") {
            return {
              message: "Você deve fornecer o cabeçalho da proteína desejada como texto.",
              valid: false
            }
          }

          if(value.length < 3) {
            return {
              message: "O cabeçalho da proteína deve ter mais do que 3 caracteres",
              valid: false
            }
          }

          if(!/^>/g.test(value)) {
            return {
              message: "Você deve fornecer o cabeçalho da proteína desejada no formato FASTA.",
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
    const form = $event.target as HTMLElement;
    const inputSubmit = form.querySelector(`.upload__form__form input[type="submit"]`) as HTMLElement;
    this.loadingService.startLoading(inputSubmit)
    const validations = this.validations;
    const errorParagraph = form.querySelector(".upload__form__form--error") as HTMLElement
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
        this.validationService.setError({valid: false, message:"Esse Workspace já existe."}, errorParagraph)
        return;
      }
      this.createWorkspaceService.create(this.workspaceName as string, this.mutationsFile, this.refseqCode as string, this.proteinSequence as string, this.proteinHeader as string)
      .then(success => {
        this.loadingService.stopLoading()
        if(!success) {
          this.validationService.setError({valid: false, message:"Houve um erro ao executar o Upload do Arquivo."}, errorParagraph)
          return;
        }
        this.alertService.show("Workspace Criado!", `O Workspace de nome ${this.workspaceName} foi criado.`)
        this.resetForm()
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

  handleChangeProteinHeader() {
    this.proteinSequence = this.proteinSequence?.replace(/\s/g, "")
  }

  set buttonUploadText(value: string) {
    const button = document.querySelector(".upload__form__form__inputGroup--file");
    if(!button) {
      return
    }
    button.innerHTML = value
  }


  private resetButtonUpload() {
    this.buttonUploadText = "Escolha o arquivo..."
  }

  private resetForm() {
    this.workspaceName = undefined;
    this.proteinSequence = undefined;
    this.refseqCode = undefined;
    this.mutationsFile = undefined;
    this.proteinHeader = undefined;
    this.resetButtonUpload();
  }

}
