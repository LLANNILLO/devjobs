import type { ReactNode } from 'react';

import { useState } from 'react';

import type { Job } from '../types.ts';

interface JobCardProps {
	readonly job: Job;
}

export function JobCard({ job }: JobCardProps): ReactNode {
	const [isApplied, setIsApplied] = useState(false);

	const handleApply = (): void => {
		setIsApplied(true);
	};

	return (
		<article>
			<div>
				<h3>{job.titulo}</h3>
				<small>
					{job.empresa} | {job.ubicacion}
				</small>
				<p>{job.descripcion}</p>
			</div>
			<button
				className={
					isApplied ? 'button-apply-job is-applied' : 'button-apply-job'
				}
				onClick={handleApply}
				type='button'
			>
				{isApplied ? 'Aplicado' : 'Aplicar'}
			</button>
		</article>
	);
}
