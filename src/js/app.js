import CollapsibleWidget from "./CollapsibleWidget";
import ArticleWidget from "./ArticleWidget";

let mainElement;

document.addEventListener("DOMContentLoaded", () => {
  mainElement = document.querySelector("main");
  new CollapsibleWidget(
    mainElement,
    (ownerElement) => new ArticleWidget(ownerElement)
  );
});
