import TimelineWidget from "./TimelineWidget";
import SharedMediaWidget from "./SharedMediaWidget";
import messageTypes from "./messageTypes";
import SpinnerDialogWidget from "./SpinnerDialogWidget";
import AttachmentsLoader from "./FileLoader";

export default class Application {
  constructor(mainElement) {
    this.mainElement = mainElement;
    this.messages = [];
    this.timeLineWidget = new TimelineWidget(this, mainElement);
    this.sharedMediaWidget = new SharedMediaWidget(this, mainElement);
  }

  addMessage(message) {
    if (message.type == messageTypes.text && message.attachments && message.attachments.length > 0) {
      this.loadFiles(message);
    }
    this.messages.push(message);
    this.timeLineWidget.addMessage(message);
    this.sharedMediaWidget.refreshContent();
  }

  loadFiles(message) {
    const spinner = new SpinnerDialogWidget(this.mainElement);
    const loader = new AttachmentsLoader(message.attachments);
    loader.load(() => {
      spinner.close();
    });
  }
}
