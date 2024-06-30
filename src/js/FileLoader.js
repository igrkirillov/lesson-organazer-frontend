export default class AttachmentsLoader {
  constructor(message) {
    this.message = message;
    this.countUp = 0;
  }

  load() {
    return new Promise((resolve, reject) => {
      this.countUp = 0;
      const loader = this;
      for (const attachment of this.message.attachments) {
        const reader = new FileReader();
        reader.addEventListener("load", (event) => {
          attachment.arrayBuffer = event.target.result;
          loader.countUp += 1;
          if (loader.countUp === loader.message.attachments.length) {
            resolve(this.message);
          }
        });
        reader.addEventListener("error", () => {
          reject();
        });
        reader.readAsArrayBuffer(attachment.file);
      }
    });
  }
}
