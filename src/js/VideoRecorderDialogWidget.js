export default class VideoRecorderDialogWidget {
  constructor(ownerElement, okCallback, cancelCallback) {
    this.ownerElement = ownerElement;
    this.element = this.createElement(ownerElement);
    this.okCallback = okCallback;
    this.cancelCallback = cancelCallback;
    this.stream = null;
    this.mediaRecorder = null;
    this.data = null;
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
    <div class="video-recorder-dialog">
      <div class="video-recorder-dialog-title">
          Запись видео-сообщения
      </div>
      <div class="video-recorder-dialog-container">
          <div class="video-recorder-dialog-message">Идёт видео-запись...</div>
          <video class="video-recorder-video"></video>
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
    return this.element.querySelector(".video-recorder-video");
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
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: true
    });
    this.videoElement.srcObject = this.stream;
  }

  startRecording() {
    this.data = [];
    this.mediaRecorder = new MediaRecorder(this.stream);

    this.onEventDataAvailable = this.onEventDataAvailable.bind(this.mediaRecorder);
    this.mediaRecorder.addEventListener("dataavailable", this.onEventDataAvailable);
    this.mediaRecorder.start();
  }

  onEventDataAvailable(event) {
    this.data.push(event.data);
  }

  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }
  }

  stopStream() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.videoElement.srcObject = null;
      this.stream = null;
    }
  }

  onClickOk() {
    this.stopRecording();
    this.stopStream();
    this.okCallback(new Blob(this.data));
    this.close();
  }

  onClickCancel() {
    this.stopRecording();
    this.stopStream();
    this.cancelCallback();
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

    this.data = null;
    this.mediaRecorder = null;
  }
}
