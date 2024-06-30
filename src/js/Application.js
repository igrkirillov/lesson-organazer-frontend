import TimelineWidget from "./TimelineWidget";
import SharedMediaWidget from "./SharedMediaWidget";
import messageTypes from "./messageTypes";
import SpinnerDialogWidget from "./SpinnerDialogWidget";
import AttachmentsLoader from "./FileLoader";
import {
  addMessageToServer,
  addWsMessageListener,
  createWebSocket,
  getClientId,
  getMessagesPage,
} from "./serverApi";
import constants from "./constants";

export default class Application {
  constructor(mainElement) {
    this.clientId = null;
    this.messages = [];
    this.timeLineWidget = new TimelineWidget(this, mainElement);
    this.sharedMediaWidget = new SharedMediaWidget(this, mainElement);
    this.ws = createWebSocket();
    this.addListeners();
    // загружаем порцию свежих сообщений
    this.loadPageMessages(0, constants.pageSize);
  }

  addListeners() {
    this.onAddMessageFromWs = this.onAddMessageFromWs.bind(this);
    addWsMessageListener(this.ws, this.onAddMessageFromWs);
  }

  onAddMessageFromWs(message) {
    if (this.clientId !== message.clientId) {
      this.addMessage(message);
    } else {
      console.log("Message from ws belongs me");
    }
  }

  async loadPageMessages(pageIndex, pageSize) {
    const spinner = this.createSpinner();
    if (!this.clientId) {
      await getClientId().then((clientId) => {
        console.log("ClientId " + clientId);
        this.clientId = clientId;
        this.sharedMediaWidget.refreshContent();
      });
    }
    return getMessagesPage(pageIndex, pageSize)
      .then((page) => {
        this.addPage(page);
      })
      .finally(() => {
        spinner.close();
      });
  }

  saveMessage(message) {
    const spinner = new SpinnerDialogWidget(
      this.timeLineWidget.savedMessagesContentElement
    );
    this.prepareDataIfNeed(message)
      .then((loadedMessage) => {
        return addMessageToServer(loadedMessage);
      })
      .then((savedMessage) => {
        this.addMessage(savedMessage);
      })
      .finally(() => {
        spinner.close();
      });
  }

  addMessage(savedMessage) {
    this.messages.push(savedMessage);
    this.timeLineWidget.addMessage(savedMessage);
    this.sharedMediaWidget.refreshContent();
  }

  addPage(page) {
    const messages = page.messages;
    if (messages && messages.length > 0) {
      this.messages.unshift(...messages);
      this.timeLineWidget.addMessages(messages);
      this.sharedMediaWidget.refreshContent();
    }
    if (page.beforeCount > 0) {
      this.timeLineWidget.addPaginator(page);
    }
  }

  prepareDataIfNeed(message) {
    if (
      message.type === messageTypes.text &&
      message.attachments &&
      message.attachments.length > 0
    ) {
      const loader = new AttachmentsLoader(message);
      return loader.load();
    } else if (
      message.type === messageTypes.video ||
      message.type === messageTypes.audio
    ) {
      return message.data.arrayBuffer().then((arrayBuffer) => {
        message.arrayBuffer = arrayBuffer;
        return message;
      });
    } else {
      return Promise.resolve(message);
    }
  }

  createSpinner() {
    return new SpinnerDialogWidget(
      this.timeLineWidget.savedMessagesContentElement
    );
  }
}
