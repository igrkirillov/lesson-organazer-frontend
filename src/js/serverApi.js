import config from "./config.json";
import Message from "./Message";

const baseUrl = config.serverUrl;

export async function allMessagesFromServer() {
  const url = makeUrl({
    method: "allMessages",
  });
  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then((response) => response.json())
    .then((json) => parseDtoArrayJson(json));
}

export async function addMessageToServer(dto) {
  const url = makeUrl({
    method: "addMessage",
  });
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: messageToJson(dto),
  })
    .then((response) => response.json())
    .then((json) => parseDtoJson(json));
}

function makeUrl(queryParams) {
  const queryParamsMap = new Map(Object.entries(queryParams || {}));
  let url = baseUrl;
  if (queryParamsMap.size > 0) {
    url += "?";
  }
  let index = 0;
  for (const entry of queryParamsMap.entries()) {
    if (index !== 0) {
      url += "&";
    }
    url += entry[0] + "=" + entry[1];
    ++index;
  }
  return url;
}

function parseDtoJson(json) {
  return new Message(
    json.id,
    json.type,
    json.data,
    parseDateTime(json.dateTime)
  );
}

function messageToJson(message) {
  return JSON.stringify(message, (key, value) => {
    if (key === "dateTime") {
      return dateTimeToString(message.dateTime);
    } else {
      return value;
    }
  })
}

function parseDateTime(dateTime) {
  // example 25-06-2024 18:05:06
  const dateAndTime = dateTime.split(" ");
  const dateParts = dateAndTime[0].split("-");
  const timeParts = dateAndTime[1].split(":");
  return new Date(+dateParts[2], +dateParts[1], +dateParts[0], +timeParts[0], +timeParts[1], +timeParts[2]);
}

function dateTimeToString(dateTime) {
  console.log(dateTime)
  return `${dateTime.getDate()}-${dateTime.getMonth()}-${dateTime.getFullYear()} ${dateTime.getHours()}:${dateTime.getMinutes()}:${dateTime.getSeconds()}`;
}

function parseDtoArrayJson(jsonArray) {
  const array = [];
  if (jsonArray) {
    for (const dtoJson of jsonArray) {
      array.push(parseDtoJson(dtoJson));
    }
  }
  return array;
}
