import type { Job } from '../../domain/job.ts';

// Write side: works with aggregates. Read models live with their queries.
export interface JobRepository {
	readonly delete: (id: string) => Promise<void>;
	readonly getById: (id: string) => Promise<Job | undefined>;
	readonly insert: (job: Job) => Promise<void>;
	readonly update: (job: Job) => Promise<void>;
}
