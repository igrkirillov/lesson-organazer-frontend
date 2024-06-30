import { checkValidityLocationText, parseTextToLocationDto } from "./utils";
import ToolTipWidget from "./ToolTipWidget";

export default class ManualLocationDialogWidget {
  constructor(ownerElement, okCallback, cancelCallback) {
    this.ownerElement = ownerElement;
    this.element = this.createElement(ownerElement);
    this.okCallback = okCallback;
    this.cancelCallback = cancelCallback;
    this.locTipWidget = new ToolTipWidget(this.locationElement);
    this.addListeners();
    this.validateForm();
    this.setFocus();
  }

  createElement(ownerElement) {
    const element = document.createElement("div");
    element.classList.add("manual-location-dialog-base");
    element.innerHTML = `
    <div class="manual-location-dialog">
      <div class="manual-location-dialog-title">
          Что-то пошло не так
      </div>
      <div class="manual-location-dialog-description">
          К сожалению, нам не удалось определить ваше местоположение,
          пожалуйста, дайте разрешение на использование ваших координат,
          либо введите координаты через запятую вручную
      </div>
      <div class="manual-location-dialog-container">
          <div class="manual-location-dialog-fields">
              <label for="location">Введите координаты xxxx.xxxx, xxxx.xxxx</label>
              <input id="location" type="text" class="manual-location-dialog-location">
          </div>
          <div class="manual-location-dialog-buttons">
              <input class="manual-location-dialog-cancel" type="submit" value="Отмена">              
              <input class="manual-location-dialog-ok" type="submit" value="OK">
          </div>
      </div>
    </div>`;
    ownerElement.appendChild(element);
    return element;
  }

  get locationElement() {
    return this.element.querySelector(".manual-location-dialog-location");
  }

  get okButtonElement() {
    return this.element.querySelector(".manual-location-dialog-ok");
  }

  get cancelButtonElement() {
    return this.element.querySelector(".manual-location-dialog-cancel");
  }

  addListeners() {
    this.onClickOk = this.onClickOk.bind(this);
    this.onClickCancel = this.onClickCancel.bind(this);
    this.onLocationKeyDown = this.onLocationKeyDown.bind(this);
    this.onFocusLocation = this.onFocusLocation.bind(this);
    this.okButtonElement.addEventListener("click", this.onClickOk);
    this.cancelButtonElement.addEventListener("click", this.onClickCancel);
    this.locationElement.addEventListener("keydown", this.onLocationKeyDown);
    this.locationElement.addEventListener("focus", this.onFocusLocation);
  }

  onClickOk() {
    if (!this.validateForm()) {
      return;
    }
    this.okCallback(parseTextToLocationDto(this.locationElement.value));
    this.close();
  }

  onClickCancel() {
    this.locTipWidget.close();
    this.cancelCallback();
    this.close();
  }

  onLocationKeyDown(event) {
    this.locTipWidget.close();
    if (event.key === "Enter" || event.keyCode === 13) {
      this.okCallback(parseTextToLocationDto(this.locationElement.value));
      this.close();
    }
  }

  onFocusLocation() {
    this.locTipWidget.close();
  }

  validateForm() {
    let validity;
    this.locTipWidget.close();
    try {
      checkValidityLocationText(this.locationElement.value);
      validity = true;
    } catch (e) {
      this.locTipWidget.open(e.message);
      validity = false;
    }
    return validity;
  }

  close() {
    this.okButtonElement.removeEventListener("click", this.onClickOk);
    this.cancelButtonElement.removeEventListener("click", this.onClickCancel);
    this.locationElement.removeEventListener("keydown", this.onLocationKeyDown);
    this.locationElement.removeEventListener("focus", this.onFocusLocation);
    this.ownerElement.removeChild(this.element);
  }

  setFocus() {
    this.locationElement.focus();
  }
}
