// Wire format of the /jobs endpoints. Keys stay in Spanish because they are
// the public JSON contract; the API translates them to its English domain.

import type {
	ContractType,
	ExperienceLevel,
	Technology,
	WorkLocation,
} from './jobValues.ts';
import type { PageDto } from './pagination.ts';

export interface JobDataDto {
	readonly contractType: ContractType;
	readonly experienceLevel: ExperienceLevel;
	readonly location: WorkLocation;
	readonly technology: readonly Technology[];
}

export interface JobDto {
	readonly data: JobDataDto;
	readonly descripcion: string;
	readonly empresa: string;
	readonly id: string;
	readonly titulo: string;
	readonly ubicacion: string;
}

// Query string of GET /jobs. Every filter is optional.
export interface ListJobsParams {
	readonly contractType?: ContractType;
	readonly experienceLevel?: ExperienceLevel;
	readonly limit?: number;
	readonly location?: WorkLocation;
	readonly offset?: number;
	readonly technology?: Technology;
	readonly text?: string;
}

// GET /jobs
export type ListJobsResponse = PageDto<JobDto>;

// GET /jobs/:id
export type GetJobResponse = JobDto;

// Body of POST /jobs and PUT /jobs/:id (PATCH accepts any subset of it)
export type JobRequest = Omit<JobDto, 'id'>;

// POST /jobs
export interface CreateJobResponse {
	readonly id: string;
}
