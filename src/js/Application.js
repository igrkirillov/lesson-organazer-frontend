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
    this.prepareDataIfNeed(message)
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

  prepareDataIfNeed(message) {
    if (message.type === messageTypes.text && message.attachments && message.attachments.length > 0) {
      const loader = new AttachmentsLoader(message);
      return loader.load();
    } else if (message.type === messageTypes.video || message.type === messageTypes.audio) {
      return message.data.arrayBuffer()
        .then((arrayBuffer) => {
          message.arrayBuffer = arrayBuffer;
          return message;
        });
    } else {
      return Promise.resolve(message);
    }
  }
}
