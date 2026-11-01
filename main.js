import "./components/devjobs-avatar-element.js";
import "./components/devjobs-job-card.js";
import "./components/devjobs-job-list.js";
import "./components/devjobs-pagination.js";
import { getJobs } from "./services/jobs.js";

const form = document.querySelector("#empleos-search-form");
const jobList = document.querySelector("devjobs-job-list");
const pagination = document.querySelector("devjobs-pagination");

const params = new URLSearchParams(location.search);
jobList.page = params.get("page");

const readFilters = () => Object.fromEntries(new FormData(form));

jobList.addEventListener("jobs-paginated", (ev) => {
  const { totalPages, page } = ev.detail;
  pagination.totalPages = totalPages;
  pagination.page = page;
});

pagination.addEventListener("page-change", (ev) => {
  const { page } = ev.detail;
  jobList.page = page;
  history.pushState({ page }, "", `?page=${page}`);

  jobList.scrollIntoView({ behavior: "smooth" });
});

// "input" fires on every keystroke and on every select change
form.addEventListener("input", () => {
  jobList.filters = readFilters();
  jobList.page = 1;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
});

jobList.jobs = await getJobs();
jobList.filters = readFilters();
