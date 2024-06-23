import TimelineWidget from "./TimelineWidget";
import SharedMediaWidget from "./SharedMediaWidget";
import MessageWidget from "./MessageWidget";

export default class Application {
  constructor(mainElement) {
    this.timeLineWidget = new TimelineWidget(this, mainElement);
    this.sharedMediaWidget = new SharedMediaWidget(this, mainElement);
    this.messages = [];
  }

  addMessage(message) {
    this.messages.push(message);
    this.timeLineWidget.addMessage(message);
  }
}
