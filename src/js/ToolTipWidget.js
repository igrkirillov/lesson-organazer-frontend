export default class ToolTipWidget {
  constructor(ownerElement) {
    this.id = performance.now();
    this.ownerElement = ownerElement;
    this.element = this.createElement();
  }

  createElement() {
    const element = document.createElement("div");
    element.classList.add("tip");
    element.classList.add("tip-hidden");
    element.innerHTML = `<span class="tip-text">
        some text
      </span>`;
    document.body.appendChild(element);
    return element;
  }

  open(tipStr) {
    this.element.querySelector(".tip-text").textContent = tipStr;
    this.element.classList.remove("tip-hidden");
    this.locatePosition();
  }

  locatePosition() {
    const ownerRect = this.ownerElement.getBoundingClientRect();
    this.element.style.left =
      ownerRect.left +
      ownerRect.width / 2 -
      this.element.offsetWidth / 2 +
      "px";
    this.element.style.top = ownerRect.top - ownerRect.height - 4 + "px";
  }

  close() {
    this.element.classList.add("tip-hidden");
  }
}
