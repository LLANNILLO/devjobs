const FILTER_KEYS = {
  technology: "technology",
  location: "location",
  "contract-type": "contractType",
  "experience-level": "experienceLevel",
};

const toArray = (value) => (Array.isArray(value) ? value : [value]);

const matchesText = (job, search = "") => {
  const query = search.trim().toLowerCase();
  if (query === "") return true;

  return [job.titulo, job.empresa, job.descripcion]
    .join(" ")
    .toLowerCase()
    .includes(query);
};

const matchesFilter = (job, name, value) => {
  if (value === "") return true; // an empty select means "do not filter"

  const key = FILTER_KEYS[name];
  if (!key) return true; // unknown field: ignore it

  return toArray(job.data[key]).includes(value);
};

export const filterJobs = (jobs, filters) => {
  const { search, ...selects } = filters;

  return jobs.filter(
    (job) =>
      matchesText(job, search) &&
      Object.entries(selects).every(([name, value]) =>
        matchesFilter(job, name, value),
      ),
  );
};
