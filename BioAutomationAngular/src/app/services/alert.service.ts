import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  alertElement?: HTMLElement

  constructor() {
    this.alertElement = this.getAlert()
  }

  show(titleMessage: string, contentMessage: string) {

    if(this.alertElement === undefined) {
      throw new Error("Alert Element is not available")
    }

    const title = this.getElementInsideAlert(".alert__header--title");
    const content = this.getElementInsideAlert(".alert__body--content");
    const closeButton = this.getElementInsideAlert(".alert__header--close");
    title.textContent = titleMessage
    content.textContent = contentMessage

    this.alertElement.classList.add("show");

    const setTimeOutId = setTimeout(() => {
      this.hide()
    }, 10000);

    closeButton.addEventListener("click", (event) => {
      event.preventDefault();
      this.hide(setTimeOutId)
    })

    return;
  }

  private hide(timeOutId: NodeJS.Timeout | null = null) {
    if(this.alertElement === undefined) {
      throw new Error("Alert Element is not available")
    }

    this.alertElement.classList.remove("show")

    if(timeOutId !== null) {
      return clearTimeout(timeOutId)
    }
  }

  private getAlert(): HTMLElement {
    const element = document.querySelector(".alert")
    if(element === null) {
      throw new Error("Alert element is not available");
    }
    return element as HTMLElement
  }

  private getElementInsideAlert(selector: string): HTMLElement {
    if(this.alertElement === undefined) {
      throw new Error("Alert Element is not available")
    }
    const element = this.alertElement.querySelector(selector);
    if(element === null) {
      throw new Error("Element required inside Alert is not available")
    }
    return element as HTMLElement;
  }
}
