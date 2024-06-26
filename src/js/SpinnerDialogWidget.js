import spinner from "/src/icons/spinner.gif";

export default class SpinnerDialogWidget {
  constructor(ownerElement) {
    this.ownerElement = ownerElement;
    this.element = this.createElement(ownerElement);
    this.setPosition();
  }

  createElement(ownerElement) {
    const element = document.createElement("div");
    element.classList.add("spinner-dialog-base");
    element.innerHTML = `
    <div class="spinner-dialog">      
      <div class="enter-dialog-container">
          <img src="${spinner}" alt="image spinner">
      </div>
    </div>`;
    ownerElement.appendChild(element);
    return element;
  }

  setPosition() {
    const ownerRect = this.ownerElement.getBoundingClientRect();
    const imageRect = this.spinnerImageElement.getBoundingClientRect();
    const style = this.spinnerDialogElement.style
    style.top = ownerRect.top + ownerRect.height/2 - 200/2 + "px";
    style.left = ownerRect.left + ownerRect.width/2 - 200/2 + "px";
  }

  get spinnerDialogElement() {
    return this.ownerElement.querySelector(".spinner-dialog");
  }

  get spinnerImageElement() {
    return this.ownerElement.querySelector(".enter-dialog-container img");
  }

  close() {
    this.ownerElement.removeChild(this.element);
  }

  isClosed() {
    return !Array.from(this.ownerElement.children).includes(this.element);
  }
}
