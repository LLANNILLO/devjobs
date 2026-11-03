// RFC 9457 Problem Details: the body of every error response of the API

export interface ProblemFieldError {
	readonly field: string;
	readonly message: string;
}

export interface ProblemDetail {
	readonly detail: string;
	readonly errors?: readonly ProblemFieldError[];
	readonly instance?: string;
	readonly status: number;
	readonly title: string;
}
