import fileIcon from "../icons/file.png";
export default class FileAttachmentsWidget {
  constructor(application, ownerElement, typingAreaWidget) {
    this.application = application;
    this.element = this.createElement(ownerElement);
    this.typingAreaWidget = typingAreaWidget;
    this.files = [];
    this.addListeners();
  }

  createElement(ownerElement) {
    const element = document.createElement("div");
    element.classList.add("file-attachments");
    ownerElement.appendChild(element);
    return element;
  }

  addListeners() {}

  addFiles(files) {
    if (files && files.length > 0) {
      for (const file of files) {
        this.addFile(file);
      }
    }
  }

  onRemoveAttachmentClick(fileName, event) {
    event.preventDefault();
    this.removeAttachment(fileName);
  }

  removeAttachment(fileName) {
    const attachmentElement = Array.from(
      this.element.querySelectorAll(".file-attachment")
    ).filter((el) => el.dataset.name === fileName)[0];
    this.element.removeChild(attachmentElement);

    const fileIndex = this.files.findIndex((file) => file.name === fileName);
    this.files.splice(fileIndex, 1);
  }

  addFile(file) {
    const element = document.createElement("div");
    element.classList.add("file-attachment");
    element.dataset.name = file.name;
    element.innerHTML = `
      <img src="${fileIcon}" class="file-attachment-icon">
      <span>${file.name}</span>
      <a href="#" class="file-attachment-remove" title="Удалить">X</a>
    `;
    this.element.appendChild(element);
    this.files.push(file);

    element
      .querySelector(".file-attachment-remove")
      .addEventListener(
        "click",
        this.onRemoveAttachmentClick.bind(this, file.name)
      );
  }

  clear() {
    const filesForRemove = Array.from(this.files);
    for (const file of filesForRemove) {
      this.removeAttachment(file.name);
    }
  }

  get attachments() {
    return Array.from(this.files);
  }
}
