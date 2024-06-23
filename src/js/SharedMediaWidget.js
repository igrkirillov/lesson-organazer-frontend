import messageTypes from "./messageTypes";
import camera from "../icons/camera.png";
import microphone from "../icons/microphone.png";
import file from "../icons/file.png";

export default class SharedMediaWidget {
  constructor(application, ownerElement) {
    this.application = application;
    this.element = this.createElement(ownerElement);
    this.addListeners();
    this.refreshContent();
  }

  createElement(ownerElement) {
    const element = document.createElement("section");
    element.classList.add("shared_media");
    ownerElement.appendChild(element);

    this.createHeaderElement(element);
    this.createContentElement(element);

    return element;
  }

  createHeaderElement(parentElement) {
    const element = document.createElement("header");
    element.classList.add("shared_media_header");
    element.innerHTML = `
      <h1>Shared media</h1>
    `;
    parentElement.appendChild(element);
  }

  createContentElement(parentElement) {
    const element = document.createElement("div");
    element.classList.add("shared-media-content");
    parentElement.appendChild(element);
  }

  get sharedMediaContentElement() {
    return this.element.querySelector(".shared-media-content");
  }

  refreshContent() {
    const sharedMediaContainerElement = this.sharedMediaContentElement;
    Array.from(this.element.querySelectorAll(".shared-media-row")).forEach(element => {
      sharedMediaContainerElement.removeChild(element);
    });

    for (const messageType of Object.values(messageTypes)) {
      const element = document.createElement("div");
      element.classList.add("shared-media-row");
      element.innerHTML = `
        <div><img src="${this.getImage(messageType)}" class="shared-media-icon"></div>
        <div><span class="shared-media-info">${this.getTitle(messageType) + " " + this.getCount(messageType)}</span></div>
      `;
      this.sharedMediaContentElement.appendChild(element);
    }
  }

  getCount(messageType) {
    if (messageType !== messageTypes.text) {
      return this.application.messages
        .filter(m => m.type === messageType)
        .length;
    } else {
      return this.application.messages
        .filter(m => m.type === messageType && m.attachments && m.attachments.length > 0)
        .map(m => m.attachments.length)
        .reduce((prev, current) => prev + current, 0);
    }
  }

  getImage(messageType) {
    switch (messageType) {
      case messageTypes.video:
        return camera;
      case messageTypes.audio:
        return microphone;
      case messageTypes.text:
        return file;
      default:
        return "";
    }
  }

  getTitle(messageType) {
    switch (messageType) {
      case messageTypes.video:
        return "Видео";
      case messageTypes.audio:
        return "Аудио";
      case messageTypes.text:
        return "Файлов";
      default:
        return "";
    }
  }

  addListeners() {
  }
}
