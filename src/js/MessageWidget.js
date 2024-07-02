import { toMessageDateFormat } from "./utils";
import messageTypes from "./messageTypes";
import fileIcon from "../icons/file.png";
import { createDownloadAttachmentUrl } from "./serverApi";
import constants from "./constants";

export default class MessageWidget {
  constructor(ownerElement, messagesWidget, message) {
    this.ownerElement = ownerElement;
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
            <div class="message-location">
                Местоположение: ${this.getLocationText(message.location)}
            </div>            
        </div>
    `;
    ownerElement.appendChild(element);
    return element;
  }

  getMessageHtml(message) {
    switch (message.type) {
      case messageTypes.text:
        return `
            <div>
                <div class="message-text">${this.findAndWrapLinksHtml(
                  message.data
                )}</div>            
            </div>
            <div>
                ${
                  message.attachments
                    ? message.attachments
                        .map((at) => this.getAttachmentHtml(at))
                        .join("<br>")
                    : ""
                }
            </div>            
        `;
      case messageTypes.video:
        return `<video src="${URL.createObjectURL(
          message.data
        )}" class="video-message" controls></video>`;
      case messageTypes.audio:
        return `<audio src="${URL.createObjectURL(
          message.data
        )}" class="audio-message" controls></audio>`;
      default:
        return `<span>${message.data}</span>`;
    }
  }

  findAndWrapLinksHtml(text) {
    if (!text) {
      return text;
    }
    const matches = text.matchAll(constants.linksRegExpr);
    const origLinkSet = new Set();
    for (const match of matches) {
      const origLink = match[0];
      if (!origLinkSet.has(origLink)) {
        const wrappedLink = `<a href="${origLink}" target="_blank" rel="noreferrer">${origLink}</a>`;
        text = text.replaceAll(origLink, wrappedLink);
        origLinkSet.add(origLink);
      }
    }
    return text;
  }

  getAttachmentHtml(attachment) {
    return `
      <img src="${fileIcon}" class="file-attachment-icon" alt="attachment">
      <a href="${createDownloadAttachmentUrl(
        attachment
      )}" rel="noopener" download="${attachment.name}" 
      class="attachment-link">${attachment.name}</a>
    `;
  }

  getLocationText(location) {
    if (!location) {
      return "";
    }
    return `${location.latitude}, ${location.longitude}`;
  }

  close() {
    this.ownerElement.removeChild(this.element);
  }
}
