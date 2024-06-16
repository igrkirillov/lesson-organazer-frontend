export default class SharedMediaWidget {
  constructor(ownerElement, timelineWidget) {
    this.element = this.createElement(ownerElement);
    this.timelineWidget = timelineWidget;
    this.addListeners();
  }

  createElement(ownerElement) {
    const element = document.createElement("div");
    element.classList.add("shared_media");
    ownerElement.appendChild(element);
    return element;
  }

  addListeners() {
  }
}
