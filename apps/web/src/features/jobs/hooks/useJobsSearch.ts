import { useState } from 'react';

import type { FilterName, JobFilters } from '../model/types.ts';

import { EMPTY_FILTERS } from '../model/jobsSearch.ts';

export interface JobsSearchState {
	readonly filters: JobFilters;
	readonly handleFilterChange: (name: FilterName, value: string) => void;
	readonly handlePageChange: (page: number) => void;
	readonly handleQueryChange: (value: string) => void;
	readonly page: number;
	readonly query: string;
}

// Owns what the user is searching for. Any new criteria restarts from page 1.
export function useJobsSearch(): JobsSearchState {
	const [filters, setFilters] = useState(EMPTY_FILTERS);
	const [page, setPage] = useState(1);
	const [query, setQuery] = useState('');

	const handleFilterChange = (name: FilterName, value: string): void => {
		setFilters((current) => {
			return { ...current, [name]: value };
		});
		setPage(1);
	};

	const handleQueryChange = (value: string): void => {
		setQuery(value);
		setPage(1);
	};

	return {
		filters,
		handleFilterChange,
		handlePageChange: setPage,
		handleQueryChange,
		page,
		query,
	};
}
