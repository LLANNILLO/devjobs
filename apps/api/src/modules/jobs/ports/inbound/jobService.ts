import type { GetJobResponse, ListJobsResponse } from '@devjobs/contracts';

import type { CreateJobCommand } from '../../app/commands/createJob/command.ts';
import type { DeleteJobCommand } from '../../app/commands/deleteJob/command.ts';
import type { PatchJobCommand } from '../../app/commands/patchJob/command.ts';
import type { UpdateJobCommand } from '../../app/commands/updateJob/command.ts';
import type { GetJobQuery } from '../../app/queries/getJob/query.ts';
import type { ListJobsQuery } from '../../app/queries/listJobs/query.ts';

// What the outside world (HTTP today, CLI or gRPC tomorrow) can ask the module
export interface JobService {
	readonly createJob: (command: CreateJobCommand) => Promise<string>;
	readonly deleteJob: (command: DeleteJobCommand) => Promise<void>;
	readonly getJob: (query: GetJobQuery) => Promise<GetJobResponse>;
	readonly listJobs: (query: ListJobsQuery) => Promise<ListJobsResponse>;
	readonly patchJob: (command: PatchJobCommand) => Promise<void>;
	readonly updateJob: (command: UpdateJobCommand) => Promise<void>;
}
