import cameraIcon from "/src/icons/camera.png";
import microphoneIcon from "/src/icons/microphone.png";
import postTypes from "./postTypes";
import PostWidget from "./PostWidget";

export default class TypingAreaWidget {
  constructor(ownerElement, timelineWidget) {
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
    this.messageInputTextElement.addEventListener(
      "keydown",
      this.onMessageInputTextKeyDown
    );
  }

  get messagesFeedElement() {
    return this.element.querySelector(".posts-feed");
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
    const widget = this;
  }

  addVideoMessage(blob) {
    const post = new Post(
      postTypes.video,
      blob,
      new Date(),
      this.timelineWidget.currentLocation
    );
    this.addMessage(post);
  }

  addAudioMessage(blob) {
    const post = new Post(
      postTypes.audio,
      blob,
      new Date(),
      this.timelineWidget.currentLocation
    );
    this.addMessage(post);
  }

  addMessage(post) {
    const postWidget = new PostWidget(this.messagesFeedElement, this, post);
    this.postWidgets.push(postWidget);
  }

  setFocus() {
    this.messageInputTextElement.focus();
  }
}
