import type { ReactNode } from 'react';

import type { Job } from '../model/types.ts';

import { JobCard } from './JobCard.tsx';

interface JobListProps {
	readonly jobs: readonly Job[];
}

export function JobList({ jobs }: JobListProps): ReactNode {
	return (
		<div className='jobs-listings'>
			{jobs.length === 0 ? (
				<p className='jobs-empty'>
					No hay empleos que coincidan con tu búsqueda.
				</p>
			) : (
				jobs.map((job) => (
					<JobCard
						job={job}
						key={job.id}
					/>
				))
			)}
		</div>
	);
}
