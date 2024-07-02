import SavedMessagesWidget from "./SavedMessagesWidget";
import TypingAreaWidget from "./TypingAreaWidget";
import MessageWidget from "./MessageWidget";
import PaginatorWidget from "./PaginatorWidget";

export default class TimelineWidget {
  constructor(application, ownerElement) {
    this.application = application;
    this.element = this.createElement(ownerElement);
    this.messageWidgets = [];
    this.savedMessagesWidget = new SavedMessagesWidget(
      application,
      this.element,
      this
    );
    this.typingAreaWidget = new TypingAreaWidget(
      application,
      this.element,
      this
    );
    this.paginatorWidget = null;
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

  get firstMessageWidget() {
    return this.messageWidgets && this.messageWidgets.length > 0
      ? this.messageWidgets[0]
      : null;
  }

  addListeners() {
    this.onDragOverEvent = this.onDragOverEvent.bind(this);
    this.onDropEvent = this.onDropEvent.bind(this);
    this.element.addEventListener("dragover", this.onDragOverEvent);
    this.element.addEventListener("drop", this.onDropEvent);
  }

  onDragOverEvent(event) {
    event.preventDefault();
  }

  onDropEvent(event) {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    if (files && files.length > 0) {
      this.typingAreaWidget.addFiles(files);
    }
  }

  setFocus() {
    this.typingAreaWidget.setFocus();
  }

  addMessage(message) {
    const messageWidget = new MessageWidget(
      this.savedMessagesContentElement,
      this,
      message
    );
    this.messageWidgets.push(messageWidget);
    this.savedMessagesWidget.scrollToBottom();
  }

  addMessages(messages) {
    for (const message of messages) {
      const messageWidget = new MessageWidget(
        this.savedMessagesContentElement,
        this,
        message
      );
      if (this.firstMessageWidget) {
        this.savedMessagesContentElement.insertBefore(
          messageWidget.element,
          this.firstMessageWidget.element
        );
      }
      this.messageWidgets.unshift(messageWidget);
    }
    this.savedMessagesWidget.scrollToTop();
  }

  addPaginator(page) {
    this.paginatorWidget = new PaginatorWidget(
      this.savedMessagesContentElement,
      page,
      this.application
    );
    if (this.firstMessageWidget) {
      this.savedMessagesContentElement.insertBefore(
        this.paginatorWidget.element,
        this.firstMessageWidget.element
      );
    }
  }

  clear() {
    if (this.paginatorWidget && !this.paginatorWidget.isClosed()) {
      this.paginatorWidget.close();
    }
    this.messageWidgets.forEach((w) => w.close());
    this.messageWidgets = [];
  }
}
