import type { ReactNode } from 'react';

import { useRef, useState } from 'react';

import type { FilterName, JobFilters } from '../types.ts';

import { paginate } from '../../../shared/pagination/paginate.ts';
import { filterJobs } from '../filterJobs.ts';
import { JOBS } from '../jobs.ts';
import { JobList } from './JobList.tsx';
import { JobPaginate } from './JobPaginate.tsx';
import { JobSearch } from './JobSearch.tsx';

const JOBS_PER_PAGE = 3;
const EMPTY_FILTERS: JobFilters = {
	contractType: '',
	experienceLevel: '',
	location: '',
	technology: '',
};

// Container: owns the search state and derives the visible jobs from it
export function JobsPage(): ReactNode {
	const [filters, setFilters] = useState(EMPTY_FILTERS);
	const [page, setPage] = useState(1);
	const [query, setQuery] = useState('');

	const resultsHeadingRef = useRef<HTMLHeadingElement>(null);

	const filteredJobs = filterJobs(JOBS, filters, query);
	const paginateInfo = paginate(filteredJobs, page, JOBS_PER_PAGE);

	const handleFilterChange = (name: FilterName, value: string): void => {
		setFilters((current) => {
			return { ...current, [name]: value };
		});
		// New results always start from the first page
		setPage(1);
	};

	const handleQueryChange = (value: string): void => {
		setQuery(value);
		setPage(1);
	};

	const handlePageChange = (value: number): void => {
		setPage(value);
		resultsHeadingRef.current?.focus();
	};

	return (
		<main>
			<JobSearch
				filters={filters}
				onFilterChange={handleFilterChange}
				onQueryChange={handleQueryChange}
				query={query}
			/>
			<section>
				<h2
					ref={resultsHeadingRef}
					tabIndex={-1}
				>
					Resultados de la búsqueda
				</h2>
				<JobList jobs={paginateInfo.data} />
			</section>
			<JobPaginate
				activePage={paginateInfo.meta.page}
				nextPage={paginateInfo.meta.nextPage}
				onPageChange={handlePageChange}
				prevPage={paginateInfo.meta.prevPage}
				totalPages={paginateInfo.meta.totalPages}
			/>
		</main>
	);
}
