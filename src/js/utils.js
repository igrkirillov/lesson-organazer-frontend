import constants from "./constants";

export function toMessageDateFormat(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds} ${day}.${month}.${year}`;
}

export function parseTextToLocationDto(text) {
  let location;
  if (text) {
    const parts = text.split(/,/);
    location = new Location(+parts[0], +parts[1]);
  }
  return location;
}

export function checkValidityLocationText(text) {
  if (!text) {
    throw new Error("Поле не может быть пустым!");
  }
  if (!constants.locationTextRegExpr.test(text)) {
    throw new Error("Текст в поле не соответствует заданному формату!");
  }
}
