const template = document.createElement("template");
template.innerHTML = `
  <article class="job-listing-card">
    <div>
      <h3></h3>
      <small></small>
      <p></p>
    </div>
    <button class="button-apply-job" type="button">Aplicar</button>
  </article>
`;

class DevJobsJobCard extends HTMLElement {
  #job = null;

  constructor() {
    super();
    // Registered once: the card is moved in and out of the list when filtering,
    // and connectedCallback would run on every move.
    this.addEventListener("click", this.#handleClick);
  }

  set job(job) {
    this.#job = job;
    this.render();
  }

  get job() {
    return this.#job;
  }

  #handleClick = (event) => {
    const button = event.target.closest(".button-apply-job");
    if (!button) return;

    button.textContent = "¡Aplicado!";
    button.classList.add("is-applied");
    button.disabled = true;
  };

  render() {
    if (!this.#job) return;

    const article = template.content.firstElementChild.cloneNode(true);
    // textContent instead of innerHTML: job data never gets parsed as HTML
    article.querySelector("h3").textContent = this.#job.titulo;
    article.querySelector("small").textContent =
      `${this.#job.empresa} | ${this.#job.ubicacion}`;
    article.querySelector("p").textContent = this.#job.descripcion;

    this.replaceChildren(article);
  }
}

customElements.define("devjobs-job-card", DevJobsJobCard);
