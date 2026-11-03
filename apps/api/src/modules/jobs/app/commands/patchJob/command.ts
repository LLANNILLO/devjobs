import type { JobInput } from '../jobInput.ts';

// Partial update (PATCH): only the provided fields change
export interface PatchJobCommand extends JobInput {
	readonly id: string;
}
