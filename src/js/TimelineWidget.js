import SavedMessagesWidget from "./SavedMessagesWidget";
import TypingAreaWidget from "./TypingAreaWidget";

export default class TimelineWidget {
  constructor(ownerElement) {
    this.element = this.createElement(ownerElement);
    this.savedMessagesWidget = new SavedMessagesWidget(this.element, this);
    this.typingAreaWidget = new TypingAreaWidget(this.element, this);
    this.addListeners();
  }

  createElement(ownerElement) {
    const element = document.createElement("div");
    element.classList.add("messages_panel");
    ownerElement.appendChild(element);
    return element;
  }

  addListeners() {}

  setFocus() {
    this.typingAreaWidget.setFocus();
  }
}
