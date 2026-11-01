import { filterJobs } from "../logic/filter-jobs.js";
import { paginate } from "../logic/paginate.js";

class DevJobsJobList extends HTMLElement {
  #jobs = null; // null = not loaded yet
  #filters = {};
  #cards = new Map(); // job.id -> <devjobs-job-card>
  #page = 1;
  #perPage = 5;

  set jobs(jobs) {
    this.#jobs = jobs;
    // Cards are created once and reused, so their state (e.g. "applied")
    // survives filtering.
    this.#cards = new Map(
      jobs.map((job) => {
        const card = document.createElement("devjobs-job-card");
        card.job = job;
        return [job.id, card];
      }),
    );
    this.render();
  }

  get jobs() {
    return this.#jobs ?? [];
  }

  set filters(filters) {
    this.#filters = filters;
    this.render();
  }

  get filters() {
    return this.#filters;
  }

  set page(page) {
    this.#page = page;
    this.render();
  }

  get page() {
    return this.#page;
  }

  set perPage(perPage) {
    this.#perPage = perPage;
    this.render();
  }

  get perPage() {
    return this.#perPage;
  }

  connectedCallback() {
    this.render();
  }

  #emitPagination(meta) {
    this.dispatchEvent(
      new CustomEvent("jobs-paginated", {
        detail: { ...meta },
        bubbles: true,
      }),
    );
  }

  render() {
    if (!this.#jobs) return;

    const filteredJobs = filterJobs(this.#jobs, this.#filters);
    const visibleJobs = paginate(filteredJobs, this.#page, this.#perPage);

    this.#page = visibleJobs.meta.page;

    this.#emitPagination(visibleJobs.meta);
    if (visibleJobs.data.length === 0) {
      const empty = document.createElement("p");
      empty.className = "jobs-empty";
      empty.textContent = "No se encontraron empleos con esos filtros.";
      this.replaceChildren(empty);
      return;
    }

    this.replaceChildren(
      ...visibleJobs.data.map((job) => this.#cards.get(job.id)),
    );
  }
}

customElements.define("devjobs-job-list", DevJobsJobList);
