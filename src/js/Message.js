export default class Message {
  constructor(id, type, data, dateTime, attachments, location) {
    this.id = id;
    this.type = type;
    this.data = data;
    this.dateTime = dateTime;
    this.attachments = attachments;
    this.location = location;
  }

  setLocation(location) {
    this.location = location;
  }
}
