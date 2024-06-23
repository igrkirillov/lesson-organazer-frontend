import recorderTypes from "./recorderTypes";

export default class MediaRecorderDialogWidget {
  constructor(ownerElement, recorderType, okCallback, cancelCallback) {
    this.ownerElement = ownerElement;
    this.recorderType = recorderType;
    this.element = this.createElement(ownerElement);
    this.okCallback = okCallback;
    this.cancelCallback = cancelCallback;
    this.stream = null;
    this.mediaRecorder = null;
    this.data = null;
    this.okFlag = null;
    this.addListeners();
    (async () => {
      await this.startStream();
      this.startRecording();
    })();
  }

  createElement(ownerElement) {
    const element = document.createElement("div");
    element.classList.add("video-recorder-dialog-base");
    element.innerHTML = `
    <div class="video-recorder-dialog ${this.recorderType === recorderTypes.audio ? "video-recorder-dialog-audio" : ""}">
      <div class="video-recorder-dialog-title">
          Запись ${this.recorderType == recorderTypes.video ? "видео" : "аудио"} сообщения
      </div>
      <div class="video-recorder-dialog-container">
          <div class="video-recorder-dialog-message">Идёт ${this.recorderType == recorderTypes.video ? "видео" : "аудио"}-запись...</div>
          ${this.recorderType === recorderTypes.video ? "<video class=\"video-recorder-video\" controls></video>" : "<audio class=\"video-recorder-audio\" controls></audio>"}
          <div class="video-recorder-dialog-buttons">
              <input class="video-recorder-dialog-cancel" type="submit" value="Отмена">
              <input class="video-recorder-dialog-ok" type="submit" value="Ок">
          </div>
      </div>
    </div>`;
    ownerElement.appendChild(element);
    return element;
  }

  get videoElement() {
    return this.recorderType === recorderTypes.video
      ? this.element.querySelector(".video-recorder-video") : this.element.querySelector(".video-recorder-audio");
  }

  addListeners() {
    this.onClickOk = this.onClickOk.bind(this);
    this.onClickCancel = this.onClickCancel.bind(this);

    const okButtonElement = this.element.querySelector(".video-recorder-dialog-ok");
    const cancelButtonElement = this.element.querySelector(
      ".video-recorder-dialog-cancel"
    );

    okButtonElement.addEventListener("click", this.onClickOk);
    cancelButtonElement.addEventListener("click", this.onClickCancel);

    const videoPlayer = this.videoElement;
    this.videoElement.addEventListener("canplay", () => {
      videoPlayer.play();
    })
  }

  async startStream() {
    if (this.recorderType === recorderTypes.video) {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
    } else {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });
    }
    this.videoElement.srcObject = this.stream;
  }

  startRecording() {
    this.data = [];
    this.mediaRecorder = new MediaRecorder(this.stream);

    this.onEventDataAvailable = this.onEventDataAvailable.bind(this);
    this.mediaRecorder.addEventListener("dataavailable", this.onEventDataAvailable);

    this.onEventStopRecording = this.onEventStopRecording.bind(this);
    this.mediaRecorder.addEventListener("stop", this.onEventStopRecording);

    this.mediaRecorder.start();
  }

  onEventDataAvailable(event) {
    this.data.push(event.data);
  }

  onEventStopRecording() {
    if (this.okFlag) {
      this.okCallback(new Blob(this.data));
      this.data = null;
    } else {
      this.cancelCallback();
    }
    this.okFlag = null;
  }

  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }
    this.mediaRecorder = null;
  }

  stopStream() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.videoElement.srcObject = null;
      this.stream = null;
    }
  }

  onClickOk() {
    this.okFlag = true;
    this.stopRecording();
    this.stopStream();
    this.close();
  }

  onClickCancel() {
    this.okFlag = false;
    this.stopRecording();
    this.stopStream();
    this.close();
  }

  close() {
    const okButtonElement = this.element.querySelector(".video-recorder-dialog-ok");
    const cancelButtonElement = this.element.querySelector(
      ".video-recorder-dialog-cancel"
    );

    okButtonElement.removeEventListener("click", this.onClickOk);
    cancelButtonElement.removeEventListener("click", this.onClickCancel);

    this.ownerElement.removeChild(this.element);
  }
}
