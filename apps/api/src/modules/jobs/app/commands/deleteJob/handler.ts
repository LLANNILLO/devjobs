import type { JobRepository } from '../../../ports/outbound/jobRepository.ts';
import type { DeleteJobCommand } from './command.ts';

import { JobErrors } from '../../../domain/jobErrors.ts';

export class DeleteJobHandler {
	readonly #repository: JobRepository;

	constructor(repository: JobRepository) {
		this.#repository = repository;
	}

	async handle(command: DeleteJobCommand): Promise<void> {
		const job = await this.#repository.getById(command.id);
		if (job === undefined) {
			throw JobErrors.notFound(command.id);
		}
		await this.#repository.delete(job.id);
	}
}
