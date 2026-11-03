import type { JobRepository } from '../../../ports/outbound/jobRepository.ts';
import type { PatchJobCommand } from './command.ts';

import { JobErrors } from '../../../domain/jobErrors.ts';
import { assertJobPatch } from '../jobInput.ts';

export class PatchJobHandler {
	readonly #repository: JobRepository;

	constructor(repository: JobRepository) {
		this.#repository = repository;
	}

	async handle(command: PatchJobCommand): Promise<void> {
		assertJobPatch(command);
		const job = await this.#repository.getById(command.id);
		if (job === undefined) {
			throw JobErrors.notFound(command.id);
		}
		job.patch(command);
		await this.#repository.update(job);
	}
}
