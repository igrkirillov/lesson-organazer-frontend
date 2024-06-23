import Application from "./Application";

let mainElement;

document.addEventListener("DOMContentLoaded", () => {
  mainElement = document.querySelector("main");
  new Application(mainElement);
});
