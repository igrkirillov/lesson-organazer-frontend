export default class Message {
  constructor(type, data, dateTime, attachments) {
    this.type = type;
    this.data = data;
    this.dateTime = dateTime;
    this.attachments = attachments;
  }
}
