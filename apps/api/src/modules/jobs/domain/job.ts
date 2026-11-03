import { randomUUID } from 'node:crypto';

import type {
	ContractType,
	ExperienceLevel,
	Technology,
	WorkLocation,
} from './jobAttributes.ts';

export interface JobDetails {
	readonly contractType: ContractType;
	readonly experienceLevel: ExperienceLevel;
	readonly location: WorkLocation;
	readonly technology: readonly Technology[];
}

// Everything a job has except its identity
export interface JobDraft {
	readonly company: string;
	readonly description: string;
	readonly details: JobDetails;
	readonly location: string;
	readonly title: string;
}

export interface JobPatch {
	readonly company?: string;
	readonly description?: string;
	readonly details?: Partial<JobDetails>;
	readonly location?: string;
	readonly title?: string;
}

export interface JobSnapshot extends JobDraft {
	readonly id: string;
}

function pickDraft(draft: JobDraft): JobDraft {
	return {
		company: draft.company,
		description: draft.description,
		details: { ...draft.details, technology: [...draft.details.technology] },
		location: draft.location,
		title: draft.title,
	};
}

// Aggregate root. `create` is for new jobs, `rehydrate` rebuilds one from
// persistence without generating a new identity.
export class Job {
	readonly id: string;
	#draft: JobDraft;

	private constructor(id: string, draft: JobDraft) {
		this.id = id;
		this.#draft = pickDraft(draft);
	}

	static create(draft: JobDraft, id: string = randomUUID()): Job {
		return new Job(id, draft);
	}

	static rehydrate(snapshot: JobSnapshot): Job {
		return new Job(snapshot.id, snapshot);
	}

	// Absent fields keep their current value (a spread would copy `undefined`)
	patch(changes: JobPatch): void {
		const current = this.#draft;
		const details = changes.details ?? {};
		this.#draft = pickDraft({
			company: changes.company ?? current.company,
			description: changes.description ?? current.description,
			details: {
				contractType: details.contractType ?? current.details.contractType,
				experienceLevel:
					details.experienceLevel ?? current.details.experienceLevel,
				location: details.location ?? current.details.location,
				technology: details.technology ?? current.details.technology,
			},
			location: changes.location ?? current.location,
			title: changes.title ?? current.title,
		});
	}

	replace(draft: JobDraft): void {
		this.#draft = pickDraft(draft);
	}

	toSnapshot(): JobSnapshot {
		return { ...pickDraft(this.#draft), id: this.id };
	}
}
