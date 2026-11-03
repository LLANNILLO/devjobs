// Composition root of the jobs module: the only file that knows every
// concrete piece. Everything else depends on ports.

import type { Logger } from '../../shared/logging/logger.ts';
import type { AppContext, AppModule } from '../../shared/module.ts';
import type { JobService } from './ports/inbound/jobService.ts';

import { logUseCase } from '../../shared/logging/logger.ts';
import { InMemoryJobReader } from './adapters/driven/inMemory/jobReader.ts';
import { InMemoryJobRepository } from './adapters/driven/inMemory/jobRepository.ts';
import { InMemoryJobStore } from './adapters/driven/inMemory/jobStore.ts';
import { loadSeedJobs } from './adapters/driven/inMemory/seed.ts';
import { createJobsRouter } from './adapters/driving/http/jobsRouter.ts';
import { CreateJobHandler } from './app/commands/createJob/handler.ts';
import { DeleteJobHandler } from './app/commands/deleteJob/handler.ts';
import { PatchJobHandler } from './app/commands/patchJob/handler.ts';
import { UpdateJobHandler } from './app/commands/updateJob/handler.ts';
import { GetJobHandler } from './app/queries/getJob/handler.ts';
import { ListJobsHandler } from './app/queries/listJobs/handler.ts';

interface JobHandlers {
	readonly createJob: CreateJobHandler;
	readonly deleteJob: DeleteJobHandler;
	readonly getJob: GetJobHandler;
	readonly listJobs: ListJobsHandler;
	readonly patchJob: PatchJobHandler;
	readonly updateJob: UpdateJobHandler;
}

// Service facade implementing the inbound port, with logging per use case.
// The `JobService` return type is the compile-time interface assertion.
function createJobService(logger: Logger, handlers: JobHandlers): JobService {
	return {
		createJob: async (command) =>
			logUseCase(logger, 'CreateJob', async () =>
				handlers.createJob.handle(command)
			),
		deleteJob: async (command) =>
			logUseCase(logger, 'DeleteJob', async () =>
				handlers.deleteJob.handle(command)
			),
		getJob: async (query) =>
			logUseCase(logger, 'GetJob', async () => handlers.getJob.handle(query)),
		listJobs: async (query) =>
			logUseCase(logger, 'ListJobs', async () =>
				handlers.listJobs.handle(query)
			),
		patchJob: async (command) =>
			logUseCase(logger, 'PatchJob', async () =>
				handlers.patchJob.handle(command)
			),
		updateJob: async (command) =>
			logUseCase(logger, 'UpdateJob', async () =>
				handlers.updateJob.handle(command)
			),
	};
}

export function createJobsModule(context: AppContext): AppModule {
	// Driven adapters
	const store = new InMemoryJobStore(loadSeedJobs());
	const repository = new InMemoryJobRepository(store);
	const reader = new InMemoryJobReader(store);

	// Use cases behind the inbound port
	const jobs = createJobService(context.logger, {
		createJob: new CreateJobHandler(repository),
		deleteJob: new DeleteJobHandler(repository),
		getJob: new GetJobHandler(reader),
		listJobs: new ListJobsHandler(reader),
		patchJob: new PatchJobHandler(repository),
		updateJob: new UpdateJobHandler(repository),
	});

	// Driving adapter
	return { basePath: '/jobs', router: createJobsRouter(jobs) };
}
