export default class SavedMessagesWidget {
  constructor(ownerElement, timelineWidget) {
    this.element = this.createElement(ownerElement);
    this.timelineWidget = timelineWidget;
    this.addListeners();
  }

  createElement(ownerElement) {
    const element = document.createElement("div");
    element.classList.add("saved_messages");
    ownerElement.appendChild(element);
    return element;
  }

  addListeners() {
  }
}
