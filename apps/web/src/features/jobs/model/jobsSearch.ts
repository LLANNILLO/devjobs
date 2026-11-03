import type { JobFilters } from './types.ts';

export const JOBS_PER_PAGE = 3;

export const EMPTY_FILTERS: JobFilters = {
	contractType: '',
	experienceLevel: '',
	location: '',
	technology: '',
};

// Everything needed to ask the API for one page of results
export interface JobsSearch {
	readonly filters: JobFilters;
	readonly page: number;
	readonly perPage: number;
	readonly text: string;
}
