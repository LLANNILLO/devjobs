import { useEffect, useState } from 'react';

import type { JobsResult } from '../api/jobsApi.ts';
import type { JobsSearch } from '../model/jobsSearch.ts';

import { buildJobsQuery, fetchJobs } from '../api/jobsApi.ts';

export interface JobsState extends JobsResult {
	readonly hasFailed: boolean;
	readonly isLoading: boolean;
}

// Outcome of the last request that finished, tagged with the query it answered
interface SettledRequest {
	readonly hasFailed: boolean;
	readonly query: string;
	readonly result: JobsResult;
}

const INITIAL_REQUEST: SettledRequest = {
	hasFailed: false,
	query: '',
	result: { jobs: [], total: 0 },
};

// Loading is derived, not stored: the current search is loading until a
// response for that exact query arrives. Previous results stay on screen
// meanwhile, so the list does not flicker.
export function useJobs(search: JobsSearch): JobsState {
	const query = buildJobsQuery(search);
	const [settled, setSettled] = useState(INITIAL_REQUEST);

	useEffect(() => {
		const controller = new AbortController();

		const load = async (): Promise<void> => {
			try {
				const result = await fetchJobs(query, controller.signal);
				setSettled({ hasFailed: false, query, result });
			} catch {
				// An aborted request was replaced by a newer one: not an error
				if (!controller.signal.aborted) {
					setSettled((current) => {
						return { ...current, hasFailed: true, query };
					});
				}
			}
		};

		void load();

		// Cancels the in-flight request when the search changes (no race conditions)
		return () => {
			controller.abort();
		};
	}, [query]);

	const isCurrent = settled.query === query;

	return {
		...settled.result,
		hasFailed: isCurrent && settled.hasFailed,
		isLoading: !isCurrent,
	};
}
