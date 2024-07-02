export default class SavedMessagesWidget {
  constructor(application, ownerElement, timelineWidget) {
    this.application = application;
    this.element = this.createElement(ownerElement);
    this.timelineWidget = timelineWidget;
    this.addListeners();
  }

  createElement(ownerElement) {
    const element = document.createElement("section");
    element.classList.add("saved_messages");
    ownerElement.appendChild(element);

    this.createHeaderElement(element);
    this.createContentElement(element);

    return element;
  }

  createHeaderElement(parentElement) {
    const element = document.createElement("header");
    element.classList.add("saved_messages_header");
    element.innerHTML = `
      <div>  
        <h1>Saved messages</h1>
      </div>
      <div class="search-container">
        <input type="text" class="search-input">
        <button class="search-button">Найти</button>
        <button class="search-clear-button display-none">Очистить</button>
      </div>
    `;
    parentElement.appendChild(element);
  }

  createContentElement(parentElement) {
    const element = document.createElement("div");
    element.classList.add("saved_messages_content");
    parentElement.appendChild(element);
  }

  get savedMessagesContentElement() {
    return this.element.querySelector(".saved_messages_content");
  }

  get searchInputElement() {
    return this.element.querySelector(".search-input");
  }

  get searchButtonElement() {
    return this.element.querySelector(".search-button");
  }

  get searchClearButtonElement() {
    return this.element.querySelector(".search-clear-button");
  }

  addListeners() {
    this.onClickSearchButton = this.onClickSearchButton.bind(this);
    this.searchButtonElement.addEventListener(
      "click",
      this.onClickSearchButton
    );

    this.onClickSearchClearButton = this.onClickSearchClearButton.bind(this);
    this.searchClearButtonElement.addEventListener(
      "click",
      this.onClickSearchClearButton
    );

    this.onKeyDownSearchInput = this.onKeyDownSearchInput.bind(this);
    this.searchInputElement.addEventListener(
      "keydown",
      this.onKeyDownSearchInput
    );
  }

  onClickSearchButton() {
    this.application.reloadMessages(this.searchInputElement.value);
  }

  onClickSearchClearButton() {
    this.searchInputElement.value = "";
    this.application.reloadMessages(null);
    this.searchClearButtonElement.classList.add("display-none");
  }

  onKeyDownSearchInput(event) {
    if (!this.searchInputElement.value) {
      this.searchClearButtonElement.classList.remove("display-none");
    }
    if (event.key === "Enter" || event.keyCode === 13) {
      this.application.reloadMessages(this.searchInputElement.value);
    }
  }

  scrollToBottom() {
    let scrollableDiv = this.savedMessagesContentElement;
    scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
  }

  scrollToTop() {
    let scrollableDiv = this.savedMessagesContentElement;
    scrollableDiv.scrollTop = 0;
  }
}
