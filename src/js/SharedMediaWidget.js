export default class SharedMediaWidget {
  constructor(application, ownerElement) {
    this.application = application;
    this.element = this.createElement(ownerElement);
    this.addListeners();
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
    element.classList.add("shared_media_content");
    parentElement.appendChild(element);
  }

  addListeners() {
  }
}
