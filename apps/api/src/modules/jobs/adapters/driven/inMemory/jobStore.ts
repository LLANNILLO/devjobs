import type { JobRecord } from './jobRecord.ts';

// Plays the role of the database table. Records are cloned on the way in and
// out so no caller can mutate the stored state by reference.
export class InMemoryJobStore {
	readonly #records = new Map<string, JobRecord>();

	constructor(seed: readonly JobRecord[]) {
		for (const record of seed) {
			this.save(record);
		}
	}

	all(): JobRecord[] {
		return structuredClone([...this.#records.values()]);
	}

	find(id: string): JobRecord | undefined {
		const record = this.#records.get(id);
		return record === undefined ? undefined : structuredClone(record);
	}

	remove(id: string): void {
		this.#records.delete(id);
	}

	save(record: JobRecord): void {
		this.#records.set(record.id, structuredClone(record));
	}
}
