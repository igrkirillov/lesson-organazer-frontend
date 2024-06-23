import TimelineWidget from "./TimelineWidget";
import SharedMediaWidget from "./SharedMediaWidget";

export default class Application {
  constructor(mainElement) {
    this.messages = [];
    this.timeLineWidget = new TimelineWidget(this, mainElement);
    this.sharedMediaWidget = new SharedMediaWidget(this, mainElement);
  }

  addMessage(message) {
    this.messages.push(message);
    this.timeLineWidget.addMessage(message);
    this.sharedMediaWidget.refreshContent();
  }
}
