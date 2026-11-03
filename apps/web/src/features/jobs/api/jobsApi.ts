import type { ListJobsResponse } from '@devjobs/contracts';

import type { JobsSearch } from '../model/jobsSearch.ts';
import type { Job } from '../model/types.ts';

import { getJson } from '../../../shared/api/httpClient.ts';
import { pageToOffset } from '../../../shared/pagination/pageNavigation.ts';

export interface JobsResult {
	readonly jobs: readonly Job[];
	readonly total: number;
}

// Empty filters are left out: the API treats a missing filter as "any value"
export function buildJobsQuery({
	filters,
	page,
	perPage,
	text,
}: JobsSearch): string {
	const activeFilters = Object.entries({ ...filters, text }).filter(
		([, value]) => value.trim() !== ''
	);
	const params = new URLSearchParams([
		...activeFilters,
		['limit', String(perPage)],
		['offset', String(pageToOffset(page, perPage))],
	]);
	return params.toString();
}

export async function fetchJobs(
	query: string,
	signal: AbortSignal
): Promise<JobsResult> {
	const response = await getJson<ListJobsResponse>(`/jobs?${query}`, signal);
	return { jobs: response.data, total: response.total };
}
