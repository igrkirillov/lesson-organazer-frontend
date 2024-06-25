import spinner from "/src/icons/spinner.gif";

export default class SpinnerDialogWidget {
  constructor(ownerElement) {
    this.ownerElement = ownerElement;
    this.element = this.createElement(ownerElement);
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

  close() {
    this.ownerElement.removeChild(this.element);
  }

  isClosed() {
    return !Array.from(this.ownerElement.children).includes(this.element);
  }
}
