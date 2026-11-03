// oxlint-disable typescript/require-await -- The ports are async so a real database can replace this adapter; the in-memory store is synchronous.

import type { JobSnapshot } from '../../../domain/job.ts';
import type { JobRepository } from '../../../ports/outbound/jobRepository.ts';
import type { JobRecord } from './jobRecord.ts';
import type { InMemoryJobStore } from './jobStore.ts';

import { Job } from '../../../domain/job.ts';

function toDomain(record: JobRecord): Job {
	return Job.rehydrate({
		company: record.empresa,
		description: record.descripcion,
		details: record.data,
		id: record.id,
		location: record.ubicacion,
		title: record.titulo,
	});
}

function toRecord(snapshot: JobSnapshot): JobRecord {
	return {
		data: snapshot.details,
		descripcion: snapshot.description,
		empresa: snapshot.company,
		id: snapshot.id,
		titulo: snapshot.title,
		ubicacion: snapshot.location,
	};
}

export class InMemoryJobRepository implements JobRepository {
	readonly #store: InMemoryJobStore;

	constructor(store: InMemoryJobStore) {
		this.#store = store;
	}

	delete = async (id: string): Promise<void> => {
		this.#store.remove(id);
	};

	getById = async (id: string): Promise<Job | undefined> => {
		const record = this.#store.find(id);
		return record === undefined ? undefined : toDomain(record);
	};

	insert = async (job: Job): Promise<void> => {
		this.#store.save(toRecord(job.toSnapshot()));
	};

	update = async (job: Job): Promise<void> => {
		this.#store.save(toRecord(job.toSnapshot()));
	};
}
