import cameraIcon from "/src/icons/camera.png";
import microphoneIcon from "/src/icons/microphone.png";
import fileIcon from "/src/icons/file.png";
import messageTypes from "./messageTypes";
import Message from "./Message";
import MediaRecorderDialogWidget from "./MediaRecorderDialogWidget";
import recorderTypes from "./recorderTypes";
import FileAttachmentsWidget from "./FileAttachmentsWidget";
import LocationDeterminerWidget from "./LocationDeterminerWidget";

export default class TypingAreaWidget {
  constructor(application, ownerElement, timelineWidget) {
    this.application = application;
    this.element = this.createElement(ownerElement);

    this.fileAttachmentsWidget = this.createFileAttachmentsArea(this.element);
    this.createMessageInputArea(this.element);
    this.locationDeterminerWidget = new LocationDeterminerWidget(ownerElement);

    this.timelineWidget = timelineWidget;
    this.addListeners();
    this.setFocus();
  }

  createElement(ownerElement) {
    const element = document.createElement("div");
    element.classList.add("typing-area");
    ownerElement.appendChild(element);
    return element;
  }

  createFileAttachmentsArea(parentElement) {
    return new FileAttachmentsWidget(this.application, parentElement, this);
  }

  createMessageInputArea(parentElement) {
    const element = document.createElement("div");
    element.classList.add("message-input-container");
    element.innerHTML = `      
          <input type="text" class="message-input-text">
            <a href="#" class="message-file-link">
                <img src="${fileIcon}" class="file-icon" alt="file">
                <div class="file-container">
                    <input type="file" class="overlapped file" multiple>
                </div>    
            </a>                
          <a href="#" class="message-video-link">
              <img src="${cameraIcon}" class="camera-icon" alt="camera">
          </a>
          <a href="#" class="message-audio-link">
              <img src="${microphoneIcon}" class="microphone-icon" alt="microphone">
          </a>
    `;
    parentElement.appendChild(element);
    return element;
  }

  addListeners() {
    this.onMessageInputTextKeyDown = this.onMessageInputTextKeyDown.bind(this);
    this.messageInputTextElement.addEventListener(
      "keydown",
      this.onMessageInputTextKeyDown
    );

    this.onMessageInputVideoClick = this.onMessageInputVideoClick.bind(this);
    this.messageInputVideoElement.addEventListener(
      "click",
      this.onMessageInputVideoClick
    );

    this.onMessageInputAudioClick = this.onMessageInputAudioClick.bind(this);
    this.messageInputAudioElement.addEventListener(
      "click",
      this.onMessageInputAudioClick
    );

    this.onMessageInputFileLinkClick =
      this.onMessageInputFileLinkClick.bind(this);
    this.messageInputFileLinkElement.addEventListener(
      "click",
      this.onMessageInputFileLinkClick
    );

    this.onMessageInputFileChange = this.onMessageInputFileChange.bind(this);
    this.messageInputFileElement.addEventListener(
      "change",
      this.onMessageInputFileChange
    );
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

  get messageInputFileLinkElement() {
    return this.element.querySelector(".message-file-link");
  }

  get messageInputFileElement() {
    return this.element.querySelector(".message-file-link .file");
  }

  onMessageInputTextKeyDown(event) {
    if (event.key === "Enter" || event.keyCode === 13) {
      this.addTextMessage(this.messageInputTextElement.value);
      this.messageInputTextElement.value = "";
    }
  }

  onMessageInputVideoClick() {
    this.addVideoMessage();
  }

  onMessageInputAudioClick() {
    this.addAudioMessage();
  }

  onMessageInputFileLinkClick() {
    this.messageInputFileElement.click();
  }

  onMessageInputFileChange() {
    const files = Array.from(this.messageInputFileElement.files);
    this.addFiles(files);
    this.setFocus();
  }

  addTextMessage(text) {
    const message = new Message(
      null,
      messageTypes.text,
      text,
      new Date(),
      this.fileAttachmentsWidget.attachments
    );
    this.addMessage(message);
    this.fileAttachmentsWidget.clear();
  }

  addVideoMessage() {
    new MediaRecorderDialogWidget(
      this.timelineWidget.element,
      recorderTypes.video,
      (blob) => {
        const message = new Message(null, messageTypes.video, blob, new Date());
        this.addMessage(message);
      },
      () => {
        console.log("cancel");
      }
    );
  }

  addAudioMessage() {
    new MediaRecorderDialogWidget(
      this.timelineWidget.element,
      recorderTypes.audio,
      (blob) => {
        const message = new Message(null, messageTypes.audio, blob, new Date());
        this.addMessage(message);
      },
      () => {
        console.log("cancel");
      }
    );
  }

  addMessage(message) {
    this.locationDeterminerWidget
      .determineMyLocation()
      .then((location) => {
        message.setLocation(location);
        this.application.addMessage(message);
      })
      .catch((e) => {
        console.log("Determine location with error " + e);
      });
  }

  setFocus() {
    this.messageInputTextElement.focus();
  }

  addFiles(files) {
    if (files && files.length > 0) {
      this.fileAttachmentsWidget.addFiles(files);
    }
  }
}
