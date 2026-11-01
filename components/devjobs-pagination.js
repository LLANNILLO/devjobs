const template = document.createElement("template");
template.innerHTML = `
  <nav class="pagination" aria-label="Paginación">
    <a href="#" data-action="prev" aria-label="Página anterior">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M15 6l-6 6l6 6" />
      </svg>
    </a>

    <!-- Page links are inserted here by render() -->

    <a href="#" data-action="next" aria-label="Página siguiente">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M9 6l6 6l-6 6" />
      </svg>
    </a>
  </nav>
`;

// One numbered link; clone it once per page
const pageLinkTemplate = document.createElement("template");
pageLinkTemplate.innerHTML = `<a href="#" data-page=""></a>`;

class DevJobsPagination extends HTMLElement {
  constructor() {
    super();

    this.addEventListener("click", (ev) => {
      this.#handleClick(ev);
    });
  }

  static get observedAttributes() {
    return ["page", "total-pages"];
  }

  get page() {
    return Number(this.getAttribute("page")) || 1;
  }
  set page(value) {
    this.setAttribute("page", value);
  }

  get totalPages() {
    return Number(this.getAttribute("total-pages")) || 1;
  }
  set totalPages(value) {
    this.setAttribute("total-pages", value);
  }

  attributeChangedCallback() {
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  #handleClick = (event) => {
    const link = event.target.closest("a");

    if (!link) return;

    event.preventDefault();

    if (link.getAttribute("aria-disabled") === "true") return;

    let target;
    if (link.dataset.page) {
      target = Number(link.dataset.page);
    } else if (link.classList.contains("prev")) {
      target = this.page - 1;
    } else if (link.classList.contains("next")) {
      target = this.page + 1;
    }
    if (!target || target === this.page) return;

    this.dispatchEvent(
      new CustomEvent("page-change", {
        detail: { page: target },
        bubbles: true,
      }),
    );
  };

  #preparePageLinks(activePage, totalPages) {
    const links = [];
    for (let i = 1; i <= totalPages; i++) {
      const link = pageLinkTemplate.content.firstElementChild.cloneNode(true);
      link.textContent = i;
      link.dataset.page = i;
      if (i === activePage) {
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
      }
      links.push(link);
    }
    return links;
  }

  render() {
    if (!this.isConnected) return;

    const activePage = this.page;
    const totalPages = this.totalPages;

    // A single page needs no navigation
    if (totalPages <= 1) {
      this.replaceChildren();
      return;
    }

    const nav = template.content.firstElementChild.cloneNode(true);
    const prevButton = nav.querySelector('[data-action="prev"]');
    const nextButton = nav.querySelector('[data-action="next"]');

    nextButton.before(...this.#preparePageLinks(activePage, totalPages));

    if (activePage === 1) {
      prevButton.setAttribute("aria-disabled", "true");
    }
    if (activePage === totalPages) {
      nextButton.setAttribute("aria-disabled", "true");
    }

    this.replaceChildren(nav);
  }
}

customElements.define("devjobs-pagination", DevJobsPagination);
