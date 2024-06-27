import TimelineWidget from "./TimelineWidget";
import SharedMediaWidget from "./SharedMediaWidget";
import messageTypes from "./messageTypes";
import SpinnerDialogWidget from "./SpinnerDialogWidget";
import AttachmentsLoader from "./FileLoader";
import { addMessageToServer } from "./serverApi";

export default class Application {
  constructor(mainElement) {
    this.messages = [];
    this.timeLineWidget = new TimelineWidget(this, mainElement);
    this.sharedMediaWidget = new SharedMediaWidget(this, mainElement);
  }

  addMessage(message) {
    const spinner = new SpinnerDialogWidget(
      this.timeLineWidget.savedMessagesContentElement
    );
    this.loadAttachmentsIfNeed(message)
      .then((loadedMessage) => {
        return addMessageToServer(loadedMessage);
      })
      .then((savedMessage) => {
        this.messages.push(savedMessage);
        this.timeLineWidget.addMessage(savedMessage);
        this.sharedMediaWidget.refreshContent();
      })
      .finally(() => {
        spinner.close();
      });
  }

  loadAttachmentsIfNeed(message) {
    if (message.attachments && message.attachments.length > 0) {
      const loader = new AttachmentsLoader(message);
      return loader.load();
    } else {
      return Promise.resolve(message);
    }
  }
}
