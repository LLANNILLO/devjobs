export interface ValidationFailure {
	readonly field: string;
	readonly message: string;
}

export class ValidationError extends Error {
	readonly failures: readonly ValidationFailure[];

	constructor(failures: readonly ValidationFailure[]) {
		super('One or more validation errors occurred');
		this.name = 'ValidationError';
		this.failures = failures;
	}
}
