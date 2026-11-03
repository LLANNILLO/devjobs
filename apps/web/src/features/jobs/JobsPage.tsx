import type { ReactNode } from 'react';

import { useRef } from 'react';

import { useDebouncedValue } from '../../shared/hooks/useDebouncedValue.ts';
import { getPageNavigation } from '../../shared/pagination/pageNavigation.ts';
import { JobPaginate } from './components/JobPaginate.tsx';
import { JobResults } from './components/JobResults.tsx';
import { JobSearch } from './components/JobSearch.tsx';
import { useJobs } from './hooks/useJobs.ts';
import { useJobsSearch } from './hooks/useJobsSearch.ts';
import { JOBS_PER_PAGE } from './model/jobsSearch.ts';

// Waits for the user to stop typing before asking the API
const SEARCH_DEBOUNCE_MS = 300;

// Container: wires the search state to the API and to the presentational components
export function JobsPage(): ReactNode {
	const search = useJobsSearch();
	const text = useDebouncedValue(search.query, SEARCH_DEBOUNCE_MS);
	const jobs = useJobs({
		filters: search.filters,
		page: search.page,
		perPage: JOBS_PER_PAGE,
		text,
	});
	const navigation = getPageNavigation({
		page: search.page,
		perPage: JOBS_PER_PAGE,
		total: jobs.total,
	});

	const resultsHeadingRef = useRef<HTMLHeadingElement>(null);

	const handlePageChange = (page: number): void => {
		search.handlePageChange(page);
		resultsHeadingRef.current?.focus();
	};

	return (
		<main>
			<JobSearch
				filters={search.filters}
				onFilterChange={search.handleFilterChange}
				onQueryChange={search.handleQueryChange}
				query={search.query}
			/>
			<section>
				<h2
					ref={resultsHeadingRef}
					tabIndex={-1}
				>
					Resultados de la búsqueda
				</h2>
				<JobResults
					hasFailed={jobs.hasFailed}
					isLoading={jobs.isLoading}
					jobs={jobs.jobs}
				/>
			</section>
			<JobPaginate
				navigation={navigation}
				onPageChange={handlePageChange}
			/>
		</main>
	);
}
