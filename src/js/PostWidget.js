import {toMessageDateFormat} from "./utils";

export default class PostWidget {
  constructor(ownerElement, postsWidget, post) {
    this.element = this.createElement(ownerElement, postsWidget, post);
    this.postsWidget = postsWidget;
    this.data = post;
  }

  createElement(ownerElement, postsWidget, post) {
    const element = document.createElement("div");
    element.classList.add("post");
    element.innerHTML = `
        <div class="post-container">
            <div class="post-title">
                <span>${toMessageDateFormat(post.dateTime)}</span>
            </div>
            <div class="post-data">
                <span>${post.data}</span>
            </div>
            <div class="post-location">
                <span>[${post.location.latitude}, ${
      post.location.longitude
    }]</span>
            </div>
        </div>
    `;
    ownerElement.appendChild(element);
    return element;
  }
}
