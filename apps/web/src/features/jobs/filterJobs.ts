import type { Job, JobData, JobFilters } from './types.ts';

// An empty selection means "any value"
function matchesSelection(selected: string, value: string): boolean {
	return selected === '' || selected === value;
}

function matchesFilters(data: JobData, filters: JobFilters): boolean {
	return (
		(filters.technology === '' ||
			data.technology.includes(filters.technology)) &&
		matchesSelection(filters.location, data.location) &&
		matchesSelection(filters.contractType, data.contractType) &&
		matchesSelection(filters.experienceLevel, data.experienceLevel)
	);
}

function matchesQuery(job: Job, normalizedQuery: string): boolean {
	return [job.titulo, job.empresa].some((text) =>
		text.toLowerCase().includes(normalizedQuery)
	);
}

export function filterJobs(
	jobs: readonly Job[],
	filters: JobFilters,
	query: string
): Job[] {
	const normalizedQuery = query.trim().toLowerCase();

	return jobs.filter(
		(job) =>
			matchesFilters(job.data, filters) && matchesQuery(job, normalizedQuery)
	);
}
