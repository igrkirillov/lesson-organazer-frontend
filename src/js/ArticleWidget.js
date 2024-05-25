export default class ArticleWidget {
  constructor(ownerElement) {
    this.element = this.createElement(ownerElement);
  }

  createElement(ownerElement) {
    const element = document.createElement("div");
    element.classList.add("article");
    element.innerHTML = `
        <span class="article-text">
            Some text some text
            Some text
            Some
            Some
            text text                  
        </span>
    `;
    ownerElement.appendChild(element);
    return element;
  }
}
