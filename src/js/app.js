import TimelineWidget from "./TimelineWidget";
import SharedMediaWidget from "./SharedMediaWidget";

let mainElement;

document.addEventListener("DOMContentLoaded", () => {
  mainElement = document.querySelector("main");
  new TimelineWidget(mainElement);
  new SharedMediaWidget(mainElement);
});
