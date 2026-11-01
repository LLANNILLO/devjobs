class DevJobsAvatar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  createURL(service, username) {
    return `https://unavatar.io/${service}/${username}`;
  }

  render() {
    const service = this.getAttribute("service") ?? "github";
    const username = this.getAttribute("username") ?? "llannillo";
    const size = this.getAttribute("size") ?? "40";

    const url = this.createURL(service, username);

    this.shadowRoot.innerHTML = `
        <style>
          div {
            height: ${size}px;
            width: ${size}px;
          }
          img {
            width: 100%;
            border-radius: 100%;
          }
        </style>
        <div>
          <img
            src="${url}"
            alt="Avatar de ${username}"
            class="avatar"
          />
        </div>
      `;
  }

  connectedCallback() {
    this.render();
  }
}

customElements.define("devjobs-avatar", DevJobsAvatar);
