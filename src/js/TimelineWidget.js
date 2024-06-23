import SavedMessagesWidget from "./SavedMessagesWidget";
import TypingAreaWidget from "./TypingAreaWidget";
import MessageWidget from "./MessageWidget";

export default class TimelineWidget {
  constructor(application, ownerElement) {
    this.application = application;
    this.element = this.createElement(ownerElement);
    this.messageWidgets = [];
    this.savedMessagesWidget = new SavedMessagesWidget(application, this.element, this);
    this.typingAreaWidget = new TypingAreaWidget(application, this.element, this);
    this.addListeners();
  }

  createElement(ownerElement) {
    const element = document.createElement("div");
    element.classList.add("messages_panel");
    ownerElement.appendChild(element);
    return element;
  }

  get savedMessagesContentElement() {
    return this.savedMessagesWidget.savedMessagesContentElement;
  }

  addListeners() {}

  setFocus() {
    this.typingAreaWidget.setFocus();
  }

  addMessage(message) {
    const messageWidget = new MessageWidget(this.savedMessagesContentElement, this, message);
    this.messageWidgets.push(messageWidget);
  }
}
