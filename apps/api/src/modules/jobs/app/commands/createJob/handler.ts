import type { JobRepository } from '../../../ports/outbound/jobRepository.ts';
import type { CreateJobCommand } from './command.ts';

import { Job } from '../../../domain/job.ts';
import { assertCompleteJobInput } from '../jobInput.ts';

export class CreateJobHandler {
	readonly #repository: JobRepository;

	constructor(repository: JobRepository) {
		this.#repository = repository;
	}

	async handle(command: CreateJobCommand): Promise<string> {
		assertCompleteJobInput(command);
		const job = Job.create(command);
		await this.#repository.insert(job);
		return job.id;
	}
}
