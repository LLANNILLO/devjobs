import type { ListJobsResponse } from '@devjobs/contracts';

import type { ListJobsCriteria, ListJobsQuery } from './query.ts';

import { toListJobsCriteria } from './query.ts';

// Defined where it is used: the reader returns this query's own read model
export interface JobsListReader {
	readonly listJobs: (criteria: ListJobsCriteria) => Promise<ListJobsResponse>;
}

export class ListJobsHandler {
	readonly #reader: JobsListReader;

	constructor(reader: JobsListReader) {
		this.#reader = reader;
	}

	async handle(query: ListJobsQuery): Promise<ListJobsResponse> {
		return this.#reader.listJobs(toListJobsCriteria(query));
	}
}
