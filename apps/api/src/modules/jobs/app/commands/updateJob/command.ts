import type { JobInput } from '../jobInput.ts';

// Full replacement (PUT): every field is required
export interface UpdateJobCommand extends JobInput {
	readonly id: string;
}
