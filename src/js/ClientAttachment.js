export default class ClientAttachment {
  constructor(file) {
    this.file = file;
    this.arrayBuffer = null;
  }

  get name() {
    return this.file.name;
  }

  get blob() {
    return new Blob([this.arrayBuffer]);
  }
}
