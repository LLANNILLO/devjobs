import type { ReactNode, SubmitEvent } from 'react';

import type { FilterName, JobFilters } from '../types.ts';

import { FILTERS } from '../filterOptions.ts';
import { FilterSelect } from './FilterSelect.tsx';
import { SearchBar } from './SearchBar.tsx';

interface JobSearchProps {
	readonly filters: JobFilters;
	readonly onFilterChange: (name: FilterName, value: string) => void;
	readonly onQueryChange: (value: string) => void;
	readonly query: string;
}

// Filtering is live, so submitting (pressing Enter) must not reload the page
function handleSubmit(event: SubmitEvent<HTMLFormElement>): void {
	event.preventDefault();
}

export function JobSearch({
	filters,
	onFilterChange,
	onQueryChange,
	query,
}: JobSearchProps): ReactNode {
	return (
		<section className='jobs-search'>
			<h1>Encuentra tu próximo trabajo</h1>
			<p>Explora miles de oportunidades en el sector tecnológico.</p>
			<search>
				<form onSubmit={handleSubmit}>
					<SearchBar
						onChange={onQueryChange}
						value={query}
					/>
					<div className='search-filters'>
						{FILTERS.map((filter) => (
							<FilterSelect
								key={filter.name}
								label={filter.label}
								name={filter.name}
								onChange={onFilterChange}
								options={filter.options}
								value={filters[filter.name]}
							/>
						))}
					</div>
				</form>
			</search>
		</section>
	);
}
