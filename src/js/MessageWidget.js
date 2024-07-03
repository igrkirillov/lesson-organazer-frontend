import { toMessageDateFormat } from "./utils";
import messageTypes from "./messageTypes";
import fileIcon from "../icons/file.png";
import { createDownloadAttachmentUrl } from "./serverApi";
import constants from "./constants";

export default class MessageWidget {
  constructor(ownerElement, messagesWidget, message, searchText) {
    this.ownerElement = ownerElement;
    this.element = this.createElement(
      ownerElement,
      messagesWidget,
      message,
      searchText
    );
    this.messagesWidget = messagesWidget;
    this.data = message;
    this.objectUrl = null;
  }

  createElement(ownerElement, messagesWidget, message, searchText) {
    const element = document.createElement("div");
    element.classList.add("message");
    element.innerHTML = `
        <div class="message-container">
            <div class="message-title">
                <span>${toMessageDateFormat(message.dateTime)}</span>
            </div>
            <div class="message-data">
                ${this.getMessageHtml(message, searchText)}
            </div>
            <div class="message-location">
                Местоположение: ${this.getLocationText(message.location)}
            </div>            
        </div>
    `;
    ownerElement.appendChild(element);
    return element;
  }

  getMessageHtml(message, searchText) {
    switch (message.type) {
      case messageTypes.text:
        return `
            <div>
                <div class="message-text">
                    ${this.findAndWrapLinksAndSelectSearchText(message.data, searchText)}
                </div>            
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
      case messageTypes.video: {
        this.objectUrl = URL.createObjectURL(message.data);
        return `<video src="${this.objectUrl}" class="video-message" controls></video>`;
      }
      case messageTypes.audio: {
        this.objectUrl = URL.createObjectURL(message.data);
        return `<audio src="${this.objectUrl}" class="audio-message" controls></audio>`;
      }
      default:
        return `<span>${message.data}</span>`;
    }
  }

  findAndWrapLinksAndSelectSearchText(text, searchText) {
    if (!text) {
      return text;
    }
    const textParts = [];
    let currentIndex = 0;
    const matches = text.matchAll(constants.linksRegExpr);
    for (const match of matches) {
      const origLink = match[0];
      const wrappedLink = `<a href="${origLink}" target="_blank" rel="noreferrer">${this.findAndWrapMatchedText(origLink, searchText)}</a>`;
      if (match.index > currentIndex) {
        textParts.push(this.findAndWrapMatchedText(text.substring(currentIndex, match.index), searchText));
      }
      textParts.push(wrappedLink);
      currentIndex = match.index + origLink.length;
    }
    if (currentIndex != text.length - 1) {
      textParts.push(this.findAndWrapMatchedText(text.substring(currentIndex, text.length), searchText));
      currentIndex = text.length - 1;
    }
    return textParts.join("");
  }

  findAndWrapMatchedText(text, searchText) {
    if (!text || !searchText || searchText.length === 0 || text.length === 0) {
      return text;
    }
    const regExpr = new RegExp(`(${searchText})`, "gi");
    console.log(regExpr);
    const matches = text.matchAll(regExpr);
    const origSet = new Set();
    for (const match of matches) {
      const orig = match[0];
      if (!origSet.has(orig)) {
        const wrapped = `<span class="selected-text">${orig}</span>`;
        text = text.replaceAll(orig, wrapped);
        origSet.add(orig);
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
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
    this.ownerElement.removeChild(this.element);
  }
}
