// Business rule violations raised by any module. The HTTP layer maps `kind`
// to a status code, so modules never deal with HTTP concerns.

export type ErrorKind = 'conflict' | 'notFound' | 'validation';

export interface DomainErrorProps {
	readonly code: string;
	readonly kind: ErrorKind;
	readonly message: string;
}

export class DomainError extends Error {
	readonly code: string;
	readonly kind: ErrorKind;

	constructor({ code, kind, message }: DomainErrorProps) {
		super(message);
		this.name = 'DomainError';
		this.code = code;
		this.kind = kind;
	}
}
