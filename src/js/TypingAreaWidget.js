import cameraIcon from "/src/icons/camera.png";
import microphoneIcon from "/src/icons/microphone.png";
import messageTypes from "./messageTypes";
import Message from "./Message";
import MessageWidget from "./MessageWidget";
import MediaRecorderDialogWidget from "./MediaRecorderDialogWidget";
import recorderTypes from "./recorderTypes";

export default class TypingAreaWidget {
  constructor(application, ownerElement, timelineWidget) {
    this.application = application;
    this.element = this.createElement(ownerElement);
    this.timelineWidget = timelineWidget;
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
    this.onMessageInputVideoClick = this.onMessageInputVideoClick.bind(this);
    this.onMessageInputAudioClick = this.onMessageInputAudioClick.bind(this);
    this.messageInputTextElement.addEventListener("keydown", this.onMessageInputTextKeyDown);
    this.messageInputVideoElement.addEventListener("click", this.onMessageInputVideoClick);
    this.messageInputAudioElement.addEventListener("click", this.onMessageInputAudioClick);
  }

  get messageInputTextElement() {
    return this.element.querySelector(".message-input-text");
  }

  get messageInputVideoElement() {
    return this.element.querySelector(".message-video-link");
  }

  get messageInputAudioElement() {
    return this.element.querySelector(".message-audio-link");
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

  onMessageInputVideoClick(event) {
    this.addVideoMessage(null);
  }

  onMessageInputAudioClick(event) {
    this.addAudioMessage(null);
  }

  addTextMessage(text) {
    const message = new Message(
      messageTypes.text,
      text,
      new Date());
    this.addMessage(message);
  }

  addVideoMessage(blob) {
    new MediaRecorderDialogWidget(
      this.timelineWidget.element,
      recorderTypes.video,
      (blob) => {
        const message = new Message(
          messageTypes.video,
          blob,
          new Date()
        );
        this.addMessage(message);
      },
      () => {
        console.log("cancel");
      }
    );
  }

  addAudioMessage(blob) {
    new MediaRecorderDialogWidget(
      this.timelineWidget.element,
      recorderTypes.audio,
      (blob) => {
        const message = new Message(
          messageTypes.audio,
          blob,
          new Date()
        );
        this.addMessage(message);
      },
      () => {
        console.log("cancel");
      }
    );
  }

  addMessage(message) {
    this.application.addMessage(message);
  }

  setFocus() {
    this.messageInputTextElement.focus();
  }
}
