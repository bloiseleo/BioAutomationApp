import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  inputToBlock?: HTMLElement | NodeList;
  menu?: HTMLElement;

  freezeClickFunction: (event: Event) => void = (event) => {
    event.stopPropagation();
    event.preventDefault()
  }

  constructor() { }

  freezeClick() {
    document.addEventListener("click", this.freezeClickFunction)
  }
  unfreezeClick() {
    document.removeEventListener("click", this.freezeClickFunction)
  }

  startLoading(inputToBlock: HTMLElement | NodeListOf<HTMLElement>) {
    this.inputToBlock = inputToBlock;
    const body = document.querySelector("body");
    const menu = document.querySelector(".sidebar__menu") as HTMLElement | null;
    if(menu === null) {
      throw new Error("Menu was not selected")
    }
    this.menu = menu;
    this.menu.style.display = 'none'
    if(body === null) {
      throw new Error("Body was not selected")
    }
    body.style.cursor = "wait"
    this.freezeClick()
    if(this.inputToBlock instanceof NodeList) {
      this.inputToBlock.forEach((input) => {
        const inputElement = input as HTMLElement;
        inputElement.classList.add("blocked")
      })
      return;
    }
    this.inputToBlock.classList.add("blocked")
  }

  stopLoading() {
    const body = document.querySelector("body");
    if(body === null) {
      throw new Error("Body was not selected")
    }
    body.style.cursor = "unset"

    if(this.menu === undefined) {
      throw new Error("Menu was not selected")
    }

    this.unfreezeClick()
    if(this.inputToBlock instanceof NodeList) {
      this.inputToBlock.forEach((input) => {
        const inputElement = input as HTMLElement;
        inputElement.classList.remove("blocked")
      })
    } else {
      this.inputToBlock?.classList.remove("blocked")
    }
    this.menu.style.display = 'unset'
    this.inputToBlock = undefined;
    this.menu = undefined;
  }
}
