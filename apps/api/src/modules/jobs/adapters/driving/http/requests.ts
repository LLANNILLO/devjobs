// Request DTOs: translate the wire format (Spanish JSON keys, query strings)
// into commands and queries, so HTTP details never reach the application.

import type { JobRequest, ListJobsParams } from '@devjobs/contracts';

import type { JobInput } from '../../../app/commands/jobInput.ts';
import type { ListJobsQuery } from '../../../app/queries/listJobs/query.ts';

import { FieldReader } from '../../../../../shared/http/fieldReader.ts';
import { ValidationError } from '../../../../../shared/validation/validationError.ts';

const INTEGER_PATTERN = /^-?\d+$/v;

// Command field -> wire field, used to report validation failures with the
// names the client actually sent
const WIRE_FIELDS: Readonly<Record<string, string>> = {
	company: 'empresa',
	description: 'descripcion',
	details: 'data',
	location: 'ubicacion',
	title: 'titulo',
};

export function readJobBody(body: unknown): JobInput {
	const reader = FieldReader.object<JobRequest>(body, 'body');
	const data = reader.nested('data');
	const input: JobInput = {
		company: reader.string('empresa'),
		description: reader.string('descripcion'),
		details: {
			contractType: data.string('contractType'),
			experienceLevel: data.string('experienceLevel'),
			location: data.string('location'),
			technology: data.stringList('technology'),
		},
		location: reader.string('ubicacion'),
		title: reader.string('titulo'),
	};
	reader.throwIfInvalid();
	return input;
}

// An empty query parameter (`?technology=`) means "no filter"
function blankToUndefined(value: string | undefined): string | undefined {
	return value === undefined || value.trim() === '' ? undefined : value;
}

function toInteger(value: string | undefined): number | undefined {
	if (value === undefined) {
		return undefined;
	}
	return INTEGER_PATTERN.test(value) ? Number(value) : Number.NaN;
}

export function readListJobsQuery(query: unknown): ListJobsQuery {
	const reader = FieldReader.object<ListJobsParams>(query, 'query');
	const read = (key: keyof ListJobsParams): string | undefined =>
		blankToUndefined(reader.string(key));
	const result: ListJobsQuery = {
		contractType: read('contractType'),
		experienceLevel: read('experienceLevel'),
		limit: toInteger(read('limit')),
		location: read('location'),
		offset: toInteger(read('offset')),
		technology: read('technology'),
		text: read('text'),
	};
	reader.throwIfInvalid();
	return result;
}

function toWireField(field: string): string {
	const [head = '', ...rest] = field.split('.');
	return [WIRE_FIELDS[head] ?? head, ...rest].join('.');
}

export async function withWireFieldNames<TResult>(
	run: () => Promise<TResult>
): Promise<TResult> {
	try {
		return await run();
	} catch (err) {
		if (err instanceof ValidationError) {
			throw new ValidationError(
				err.failures.map((failure) => {
					return { ...failure, field: toWireField(failure.field) };
				})
			);
		}
		throw err;
	}
}
