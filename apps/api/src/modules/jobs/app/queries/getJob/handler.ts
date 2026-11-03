import type { GetJobResponse } from '@devjobs/contracts';

import type { GetJobQuery } from './query.ts';

import { JobErrors } from '../../../domain/jobErrors.ts';

export interface JobReader {
	readonly getJob: (id: string) => Promise<GetJobResponse | undefined>;
}

export class GetJobHandler {
	readonly #reader: JobReader;

	constructor(reader: JobReader) {
		this.#reader = reader;
	}

	async handle(query: GetJobQuery): Promise<GetJobResponse> {
		const job = await this.#reader.getJob(query.id);
		if (job === undefined) {
			throw JobErrors.notFound(query.id);
		}
		return job;
	}
}
