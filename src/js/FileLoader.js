export default class AttachmentsLoader {
  constructor(attachments) {
    this.attachments = attachments;
    this.countUp = 0;
  }

  load(completeCallback) {
    this.countUp = 0;
    const loader = this;
    for (const attachment of this.attachments) {
      const reader = new FileReader();
      reader.addEventListener("load", (event) => {
        attachment.data = event.target.result;
        loader.countUp += 1;
        console.log(loader.countUp);
        if (loader.countUp === loader.attachments.length) {
          completeCallback();
        }
      });
      reader.readAsArrayBuffer(attachment.file);
    }
  }
}
