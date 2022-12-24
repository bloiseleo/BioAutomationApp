import { Injectable } from '@angular/core';

interface ValidationObject {
  selector: string,
  value: unknown,
  predefined?: {
    name: "specialChars" | "hasAtLeastXChars" | "isText"
  },
  name: string
}

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  errorNow?: NodeJS.Timeout

  constructor() { }

  validate(validationObject: Array<{
    value: any,
    validationFunction: (...params: any) => {
      valid: boolean,
      message: string
    }
  }>, errorElement: HTMLElement): boolean {
    for(let i = 0; i < validationObject.length; i++) {
      const validation = validationObject[i]
      const {value, validationFunction} = validation
      const error = validationFunction(value)
      if(error.valid === false) {
        this.setError(error, errorElement)
        return false;
      }
    }
    return true;
  }

  setError(error: {
    valid: boolean,
    message: string
  }, errorElement: HTMLElement ) {
    if(this.errorNow) {
      this.resetError(errorElement)
    }
    errorElement.innerHTML = error.message
    errorElement.classList.add("show")
    this.errorNow = setTimeout(() => {
      errorElement.classList.remove("show")
    }, 5000)
    return;
  }

  private resetError(errorElement: HTMLElement) {
    errorElement.classList.remove('show')
    clearTimeout(this.errorNow)
  }


}
