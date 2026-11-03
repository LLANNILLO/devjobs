import type {
	ContractType,
	ExperienceLevel,
	Technology,
	WorkLocation,
} from '../../../domain/jobAttributes.ts';

import {
	DEFAULT_PAGE_LIMIT,
	MAX_PAGE_LIMIT,
} from '../../../../../shared/pagination/page.ts';
import { Validator } from '../../../../../shared/validation/validator.ts';
import {
	CONTRACT_TYPES,
	EXPERIENCE_LEVELS,
	TECHNOLOGIES,
	WORK_LOCATIONS,
} from '../../../domain/jobAttributes.ts';

// Every filter is optional: a missing one means "any value"
export interface ListJobsQuery {
	readonly contractType?: string;
	readonly experienceLevel?: string;
	readonly limit?: number;
	readonly location?: string;
	readonly offset?: number;
	readonly technology?: string;
	readonly text?: string;
}

// Validated and normalized version handed to the reader
export interface ListJobsCriteria {
	readonly contractType?: ContractType;
	readonly experienceLevel?: ExperienceLevel;
	readonly limit: number;
	readonly location?: WorkLocation;
	readonly offset: number;
	readonly technology?: Technology;
	readonly text?: string;
}

interface ValidListJobsQuery extends ListJobsQuery {
	readonly contractType?: ContractType;
	readonly experienceLevel?: ExperienceLevel;
	readonly location?: WorkLocation;
	readonly technology?: Technology;
}

function assertValid(
	query: ListJobsQuery
): asserts query is ValidListJobsQuery {
	new Validator()
		.oneOf('technology', query.technology, TECHNOLOGIES)
		.oneOf('location', query.location, WORK_LOCATIONS)
		.oneOf('contractType', query.contractType, CONTRACT_TYPES)
		.oneOf('experienceLevel', query.experienceLevel, EXPERIENCE_LEVELS)
		.integerInRange('limit', query.limit, { max: MAX_PAGE_LIMIT, min: 1 })
		.integerInRange('offset', query.offset, {
			max: Number.MAX_SAFE_INTEGER,
			min: 0,
		})
		.throwIfInvalid();
}

export function toListJobsCriteria(query: ListJobsQuery): ListJobsCriteria {
	assertValid(query);
	const text = query.text?.trim().toLowerCase();

	return {
		contractType: query.contractType,
		experienceLevel: query.experienceLevel,
		limit: query.limit ?? DEFAULT_PAGE_LIMIT,
		location: query.location,
		offset: query.offset ?? 0,
		technology: query.technology,
		text: text === '' ? undefined : text,
	};
}
