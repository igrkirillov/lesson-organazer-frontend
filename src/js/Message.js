export default class Message {
  constructor(clientId, id, type, data, dateTime, attachments, location) {
    this.clientId = clientId;
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
