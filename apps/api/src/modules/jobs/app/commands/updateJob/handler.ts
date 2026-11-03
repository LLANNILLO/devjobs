import type { JobRepository } from '../../../ports/outbound/jobRepository.ts';
import type { UpdateJobCommand } from './command.ts';

import { JobErrors } from '../../../domain/jobErrors.ts';
import { assertCompleteJobInput } from '../jobInput.ts';

export class UpdateJobHandler {
	readonly #repository: JobRepository;

	constructor(repository: JobRepository) {
		this.#repository = repository;
	}

	async handle(command: UpdateJobCommand): Promise<void> {
		assertCompleteJobInput(command);
		const job = await this.#repository.getById(command.id);
		if (job === undefined) {
			throw JobErrors.notFound(command.id);
		}
		job.replace(command);
		await this.#repository.update(job);
	}
}
