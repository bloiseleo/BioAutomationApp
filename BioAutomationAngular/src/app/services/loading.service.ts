import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  inputToBlock?: HTMLElement;
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

  startLoading(inputToBlock: HTMLElement) {
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
    this.inputToBlock?.classList.remove("blocked")
    this.menu.style.display = 'unset'
    this.inputToBlock = undefined;
    this.menu = undefined;
  }
}
