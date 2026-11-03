import type { ReactNode } from 'react';

import type { Job } from '../model/types.ts';

import { JobList } from './JobList.tsx';

interface JobResultsProps {
	readonly hasFailed: boolean;
	readonly isLoading: boolean;
	readonly jobs: readonly Job[];
}

export function JobResults({
	hasFailed,
	isLoading,
	jobs,
}: JobResultsProps): ReactNode {
	if (hasFailed) {
		return (
			<p
				className='jobs-empty'
				role='alert'
			>
				No se pudieron cargar los empleos. Inténtalo de nuevo más tarde.
			</p>
		);
	}

	return (
		<div aria-busy={isLoading}>
			<JobList jobs={jobs} />
		</div>
	);
}
