// Input shared by the commands that write a job (create, update, patch).
// Fields arrive untyped from the driving adapter; validation narrows them
// into the domain types.

import type { JobDraft, JobPatch } from '../../domain/job.ts';

import { Validator } from '../../../../shared/validation/validator.ts';
import {
	CONTRACT_TYPES,
	EXPERIENCE_LEVELS,
	TECHNOLOGIES,
	WORK_LOCATIONS,
} from '../../domain/jobAttributes.ts';

export interface JobDetailsInput {
	readonly contractType?: string;
	readonly experienceLevel?: string;
	readonly location?: string;
	readonly technology?: readonly string[];
}

export interface JobInput {
	readonly company?: string;
	readonly description?: string;
	readonly details?: JobDetailsInput;
	readonly location?: string;
	readonly title?: string;
}

const TEXT_FIELDS = ['company', 'description', 'location', 'title'] as const;

// When every field is required, a missing value is validated as an empty one
function validateJobInput(input: JobInput, isRequired: boolean): void {
	const present = (value: string | undefined): string | undefined =>
		isRequired ? (value ?? '') : value;
	const details = input.details ?? {};
	const validator = new Validator();

	for (const field of TEXT_FIELDS) {
		const value = present(input[field]);
		if (value !== undefined) {
			validator.required(field, value);
		}
	}

	validator
		.uniqueListOf(
			'details.technology',
			isRequired ? (details.technology ?? []) : details.technology,
			TECHNOLOGIES
		)
		.oneOf('details.location', present(details.location), WORK_LOCATIONS)
		.oneOf(
			'details.experienceLevel',
			present(details.experienceLevel),
			EXPERIENCE_LEVELS
		)
		.oneOf(
			'details.contractType',
			present(details.contractType),
			CONTRACT_TYPES
		)
		.throwIfInvalid();
}

export function assertCompleteJobInput(
	input: JobInput
): asserts input is JobDraft & JobInput {
	validateJobInput(input, true);
}

export function assertJobPatch(
	input: JobInput
): asserts input is JobInput & JobPatch {
	validateJobInput(input, false);
}
