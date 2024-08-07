import config from "./config.json";
import Message from "./Message";
import { decode, encode } from "base64-arraybuffer";
import ServerAttachment from "./ServerAttachment";
import messageTypes from "./messageTypes";
import MessagesPage from "./MessagesPage";
import Location from "./Location";

const baseUrl = config.serverUrl;
const wsUrl = config.wsUrl;

export function createDownloadAttachmentUrl(serverAttachment) {
  return makeUrl({
    method: "downloadAttachment",
    messageId: serverAttachment.messageId,
    attachmentName: serverAttachment.name,
  });
}

export async function getClientId() {
  const url = makeUrl({
    method: "getClientId",
  });
  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((json) => json.clientId);
}

export async function getMessagesPage(pageIndex, pageSize, searchText) {
  const url = makeUrl({
    method: "getPage",
    pageIndex: pageIndex,
    pageSize: pageSize,
    searchText: searchText ? searchText : "",
  });
  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((json) => parseMessagesPageJson(json));
}

export async function addMessageToServer(dto) {
  const url = makeUrl({
    method: "addMessage",
  });
  const payload = messageToJson(dto);
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: payload,
  })
    .then((response) => response.json())
    .then((json) => parseMessageJson(json));
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

function parseMessageJson(json) {
  return new Message(
    json.clientId,
    json.id,
    json.type,
    parseData(json.type, json.data),
    parseDateTime(json.dateTime),
    parseServerAttachments(json.id, json.attachmentNames),
    parseLocation(json.location)
  );
}

function parseData(messageType, data) {
  switch (messageType) {
    case messageTypes.video:
    case messageTypes.audio:
      return new Blob([decode(data)]);
    default:
      return data;
  }
}

function messageToJson(message) {
  return JSON.stringify(message, (key, value) => {
    if (key === "dateTime") {
      return dateTimeToString(message.dateTime);
    } else if (key === "attachments") {
      return (
        message.attachments &&
        mapAttachmentsToTransportObjects(message.attachments)
      );
    } else if (key === "data") {
      return mapDataToTransportObject(message);
    } else {
      return value;
    }
  });
}

function parseDateTime(dateTime) {
  // example 25-06-2024 18:05:06
  const dateAndTime = dateTime.split(" ");
  const dateParts = dateAndTime[0].split("-");
  const timeParts = dateAndTime[1].split(":");
  return new Date(
    +dateParts[2],
    +dateParts[1],
    +dateParts[0],
    +timeParts[0],
    +timeParts[1],
    +timeParts[2]
  );
}

function parseServerAttachments(messageId, attachmentNames) {
  return attachmentNames
    ? attachmentNames.map((name) => new ServerAttachment(messageId, name))
    : null;
}

function parseLocation(json) {
  if (!json) {
    return null;
  }
  return new Location(+json.latitude, +json.longitude);
}

function dateTimeToString(dateTime) {
  return `${dateTime.getDate()}-${dateTime.getMonth()}-${dateTime.getFullYear()} ${dateTime.getHours()}:${dateTime.getMinutes()}:${dateTime.getSeconds()}`;
}

function mapAttachmentsToTransportObjects(attachments) {
  const array = [];
  for (const attachment of attachments) {
    array.push({
      file: attachment.name,
      arrayBuffer: encode(attachment.arrayBuffer),
    });
  }
  return array;
}

function mapDataToTransportObject(message) {
  switch (message.type) {
    case messageTypes.audio:
    case messageTypes.video:
      return encode(message.arrayBuffer);
    default:
      return message.data;
  }
}

function parseMessagesPageJson(pageJson) {
  return new MessagesPage(
    pageJson.pageIndex,
    pageJson.pageSize,
    pageJson.beforeCount,
    pageJson.afterCount,
    parseMessagesJson(pageJson.messages)
  );
}

function parseMessagesJson(jsonArray) {
  const array = [];
  if (jsonArray) {
    for (const dtoJson of jsonArray) {
      array.push(parseMessageJson(dtoJson));
    }
  }
  return array;
}

export function createWebSocket() {
  return new WebSocket(wsUrl);
}

export function addWsMessageListener(ws, messageCallback) {
  ws.addEventListener("message", (event) => {
    const json = JSON.parse(event.data);
    if (json) {
      messageCallback(parseMessageJson(json));
    }
  });
}
