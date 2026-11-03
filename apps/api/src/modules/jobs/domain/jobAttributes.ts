// The allowed values are part of the public contract, so they come from
// @devjobs/contracts: the API and the web app can never drift apart.

import type {
	ContractType,
	ExperienceLevel,
	Technology,
	WorkLocation,
} from '@devjobs/contracts';

import {
	CONTRACT_TYPES,
	EXPERIENCE_LEVELS,
	TECHNOLOGIES,
	WORK_LOCATIONS,
} from '@devjobs/contracts';

import { isOneOf } from '../../../shared/validation/predicates.ts';

export type {
	ContractType,
	ExperienceLevel,
	Technology,
	WorkLocation,
} from '@devjobs/contracts';
export {
	CONTRACT_TYPES,
	EXPERIENCE_LEVELS,
	TECHNOLOGIES,
	WORK_LOCATIONS,
} from '@devjobs/contracts';

export function isTechnology(value: string): value is Technology {
	return isOneOf(TECHNOLOGIES, value);
}

export function isWorkLocation(value: string): value is WorkLocation {
	return isOneOf(WORK_LOCATIONS, value);
}

export function isContractType(value: string): value is ContractType {
	return isOneOf(CONTRACT_TYPES, value);
}

export function isExperienceLevel(value: string): value is ExperienceLevel {
	return isOneOf(EXPERIENCE_LEVELS, value);
}
