import { toMessageDateFormat } from "./utils";

export default class MessageWidget {
  constructor(ownerElement, messagesWidget, message) {
    this.element = this.createElement(ownerElement, messagesWidget, message);
    this.messagesWidget = messagesWidget;
    this.data = message;
  }

  createElement(ownerElement, postsWidget, message) {
    const element = document.createElement("div");
    element.classList.add("message");
    element.innerHTML = `
        <div class="message-container">
            <div class="message-title">
                <span>${toMessageDateFormat(message.dateTime)}</span>
            </div>
            <div class="message-data">
                <span>${message.data}</span>
            </div>            
        </div>
    `;
    ownerElement.appendChild(element);
    return element;
  }
}
