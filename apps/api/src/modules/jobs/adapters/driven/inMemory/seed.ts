import type { JobRecord } from './jobRecord.ts';

import {
	isContractType,
	isExperienceLevel,
	isTechnology,
	isWorkLocation,
} from '../../../domain/jobAttributes.ts';
import rawJobs from './jobs.json' with { type: 'json' };

type RawJob = (typeof rawJobs)[number];

// The JSON file is untrusted input: fail fast at startup if it drifts from
// the domain values instead of serving invalid jobs.
function toRecord(raw: RawJob): JobRecord {
	const { contractType, experienceLevel, location, technology } = raw.data;
	const technologies = technology.filter((value) => isTechnology(value));

	if (
		technologies.length !== technology.length ||
		!isWorkLocation(location) ||
		!isContractType(contractType) ||
		!isExperienceLevel(experienceLevel)
	) {
		throw new TypeError(`Invalid seed job "${raw.id}" in jobs.json`);
	}

	return {
		...raw,
		data: { contractType, experienceLevel, location, technology: technologies },
	};
}

export function loadSeedJobs(): JobRecord[] {
	return rawJobs.map((raw) => toRecord(raw));
}
