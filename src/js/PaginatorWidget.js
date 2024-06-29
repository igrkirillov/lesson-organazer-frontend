export default class PaginatorWidget {
  constructor(ownerElement, page, application) {
    this.ownerElement = ownerElement;
    this.page = page;
    this.application = application;
    this.element = this.createElement(ownerElement);
    this.addListeners();
  }

  createElement(ownerElement) {
    const element = document.createElement("div");
    element.classList.add("paginator");
    element.innerHTML = `
        <div class="paginator-container">
            <a href="#" class="paginator-link">Показать ещё ${Math.min(
              this.page.pageSize,
              this.page.beforeCount
            )} из ${this.page.beforeCount}</a>
        </div>
    `;
    ownerElement.appendChild(element);
    return element;
  }

  get paginatorLinkElement() {
    return this.element.querySelector(".paginator-link");
  }

  addListeners() {
    this.onPaginatorLinkClick = this.onPaginatorLinkClick.bind(this);
    this.paginatorLinkElement.addEventListener(
      "click",
      this.onPaginatorLinkClick
    );
  }

  onPaginatorLinkClick(event) {
    event.preventDefault();
    const widget = this;
    this.application
      .loadPageMessages(this.page.pageIndex + 1, this.page.pageSize)
      .then(() => {
        widget.close();
      });
  }

  close() {
    this.paginatorLinkElement.removeEventListener(
      "click",
      this.onPaginatorLinkClick
    );
    this.ownerElement.removeChild(this.element);
  }
}
