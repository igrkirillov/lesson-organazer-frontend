import { toMessageDateFormat } from "./utils";
import messageTypes from "./messageTypes";

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
                ${this.getMessageHtml(message)}
            </div>            
        </div>
    `;
    ownerElement.appendChild(element);
    return element;
  }

  getMessageHtml(message) {
    switch (message.type) {
      case messageTypes.text:
        return `<span>${message.data}</span>`;
      case messageTypes.video:
        return `<video src="${URL.createObjectURL(message.data)}" class="video-message" controls></video>`;
      case messageTypes.audio:
        return `<audio src="${URL.createObjectURL(message.data)}" class="audio-message" controls></audio>`;
      default:
        return `<span>${message.data}</span>`;
    }
  }
}
