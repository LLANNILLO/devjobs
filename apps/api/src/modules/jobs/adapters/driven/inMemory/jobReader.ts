// oxlint-disable typescript/require-await -- The query ports are async so a real database can replace this adapter; the in-memory store is synchronous.

import type {
	GetJobResponse,
	JobDto,
	ListJobsResponse,
} from '@devjobs/contracts';

import type { JobReader } from '../../../app/queries/getJob/handler.ts';
import type { JobsListReader } from '../../../app/queries/listJobs/handler.ts';
import type { ListJobsCriteria } from '../../../app/queries/listJobs/query.ts';
import type { JobRecord } from './jobRecord.ts';
import type { InMemoryJobStore } from './jobStore.ts';

import { paginate } from '../../../../../shared/pagination/page.ts';

// An undefined filter means "any value"
function matchesValue<TValue>(
	filter: TValue | undefined,
	value: TValue
): boolean {
	return filter === undefined || filter === value;
}

// Free text search over title and company (same rule as the web app)
function matchesText(record: JobRecord, text: string | undefined): boolean {
	if (text === undefined) {
		return true;
	}
	return [record.titulo, record.empresa].some((field) =>
		field.toLowerCase().includes(text)
	);
}

function matchesCriteria(
	record: JobRecord,
	criteria: ListJobsCriteria
): boolean {
	const { data } = record;
	return (
		matchesText(record, criteria.text) &&
		(criteria.technology === undefined ||
			data.technology.includes(criteria.technology)) &&
		matchesValue(criteria.location, data.location) &&
		matchesValue(criteria.contractType, data.contractType) &&
		matchesValue(criteria.experienceLevel, data.experienceLevel)
	);
}

function toResponse(record: JobRecord): JobDto {
	return {
		data: { ...record.data, technology: [...record.data.technology] },
		descripcion: record.descripcion,
		empresa: record.empresa,
		id: record.id,
		titulo: record.titulo,
		ubicacion: record.ubicacion,
	};
}

// Read side: maps records straight to the query read models, bypassing the
// domain (the in-memory equivalent of a SELECT ... WHERE ... LIMIT ... OFFSET)
export class InMemoryJobReader implements JobReader, JobsListReader {
	readonly #store: InMemoryJobStore;

	constructor(store: InMemoryJobStore) {
		this.#store = store;
	}

	getJob = async (id: string): Promise<GetJobResponse | undefined> => {
		const record = this.#store.find(id);
		return record === undefined ? undefined : toResponse(record);
	};

	listJobs = async (criteria: ListJobsCriteria): Promise<ListJobsResponse> => {
		const matches = this.#store
			.all()
			.filter((record) => matchesCriteria(record, criteria))
			.map((record) => toResponse(record));
		return paginate(matches, criteria);
	};
}
