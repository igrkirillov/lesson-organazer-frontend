export default class CollapsibleWidget {
  constructor(ownerElement, collapsibleElementCreator) {
    this.element = this.createElement(ownerElement);
    collapsibleElementCreator(this.collapsibleContainerElement);
    this.addListeners();
  }

  createElement(ownerElement) {
    const element = document.createElement("div");
    element.classList.add("collapsible");
    element.innerHTML = `
        <input type="button" class="collapsible-button" value="Collapsible">
        <div class="collapsible-container">
      
        </div>
    `;
    ownerElement.appendChild(element);
    return element;
  }

  get buttonElement() {
    return this.element.querySelector(".collapsible-button");
  }

  get collapsibleContainerElement() {
    return this.element.querySelector(".collapsible-container");
  }

  addListeners() {
    this.onButtonClick = this.onButtonClick.bind(this);
    this.buttonElement.addEventListener("click", this.onButtonClick);
  }

  onButtonClick() {
    const containerElement = this.collapsibleContainerElement;
    containerElement.classList.toggle("collapsible-container-collapsed");
  }
}
