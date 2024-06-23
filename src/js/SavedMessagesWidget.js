export default class SavedMessagesWidget {
  constructor(application, ownerElement, timelineWidget) {
    this.application = application;
    this.element = this.createElement(ownerElement);
    this.timelineWidget = timelineWidget;
    this.addListeners();
  }

  createElement(ownerElement) {
    const element = document.createElement("section");
    element.classList.add("saved_messages");
    ownerElement.appendChild(element);

    this.createHeaderElement(element);
    this.createContentElement(element);

    return element;
  }

  createHeaderElement(parentElement) {
    const element = document.createElement("header");
    element.classList.add("saved_messages_header");
    element.innerHTML = `
      <h1>Saved messages</h1>
    `;
    parentElement.appendChild(element);
  }

  createContentElement(parentElement) {
    const element = document.createElement("div");
    element.classList.add("saved_messages_content");
    parentElement.appendChild(element);
  }

  get savedMessagesContentElement() {
    return this.element.querySelector(".saved_messages_content");
  }

  addListeners() {
  }
}
