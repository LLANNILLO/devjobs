import type { JobDto } from '@devjobs/contracts';

// The job shown in the UI is exactly the one the API returns
export type Job = JobDto;

// UI state of the filter selects: an empty string means "any value"
export interface JobFilters {
	readonly contractType: string;
	readonly experienceLevel: string;
	readonly location: string;
	readonly technology: string;
}

export type FilterName = keyof JobFilters;
