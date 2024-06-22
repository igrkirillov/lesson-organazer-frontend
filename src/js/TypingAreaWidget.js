import cameraIcon from "/src/icons/camera.png";
import microphoneIcon from "/src/icons/microphone.png";
import messageTypes from "./messageTypes";
import Message from "./Message";
import MessageWidget from "./MessageWidget";

export default class TypingAreaWidget {
  constructor(ownerElement, timelineWidget) {
    this.element = this.createElement(ownerElement);
    this.timelineWidget = timelineWidget;
    this.messageWidgets = [];
    this.addListeners();
    this.setFocus();
  }

  createElement(ownerElement) {
    const element = document.createElement("div");
    element.classList.add("typing-area");
    element.innerHTML = `      
      <div class="message-input-container">
          <input type="text" class="message-input-text">
          <a href="#" class="message-video-link">
              <img src="${cameraIcon}" class="camera-icon" alt="camera">
          </a>
          <a href="#" class="message-audio-link">
              <img src="${microphoneIcon}" class="microphone-icon" alt="microphone">
          </a>
      </div>
    `;
    ownerElement.appendChild(element);
    return element;
  }

  addListeners() {
    this.onMessageInputButtonClick = this.onMessageInputButtonClick.bind(this);
    this.onMessageInputTextKeyDown = this.onMessageInputTextKeyDown.bind(this);
    this.messageInputTextElement.addEventListener(
      "keydown",
      this.onMessageInputTextKeyDown
    );
  }

  get messageInputTextElement() {
    return this.element.querySelector(".message-input-text");
  }

  onMessageInputButtonClick() {
    this.addTextMessage(this.messageInputTextElement.value);
    this.messageInputTextElement.value = "";
  }

  onMessageInputTextKeyDown(event) {
    if (event.key === "Enter" || event.keyCode === 13) {
      this.addTextMessage(this.messageInputTextElement.value);
      this.messageInputTextElement.value = "";
    }
  }

  addTextMessage(text) {
    const message = new Message(
      messageTypes.text,
      text,
      new Date());
    this.addMessage(message);
  }

  addVideoMessage(blob) {
    const message = new Message(
      messageTypes.video,
      blob,
      new Date()
    );
    this.addMessage(message);
  }

  addAudioMessage(blob) {
    const message = new Message(
      messageTypes.audio,
      blob,
      new Date()
    );
    this.addMessage(message);
  }

  addMessage(message) {
    const messageWidget = new MessageWidget(this.timelineWidget.savedMessagesContentElement, this, message);
    this.messageWidgets.push(messageWidget);
  }

  setFocus() {
    this.messageInputTextElement.focus();
  }
}
