import type { ProblemDetail } from '@devjobs/contracts';
import type { ErrorRequestHandler } from 'express';

import type { ErrorKind } from '../errors/domainError.ts';
import type { Logger } from '../logging/logger.ts';

import { DomainError } from '../errors/domainError.ts';
import { ValidationError } from '../validation/validationError.ts';
import { HttpStatus } from './httpStatus.ts';
import { INTERNAL_PROBLEM, writeProblem } from './problem.ts';

const CONFLICT_STATUS = 409;

const STATUS_BY_KIND: Readonly<Record<ErrorKind, number>> = {
	conflict: CONFLICT_STATUS,
	notFound: HttpStatus.NotFound,
	validation: HttpStatus.BadRequest,
};

function toProblem(err: unknown): ProblemDetail | undefined {
	if (err instanceof ValidationError) {
		return {
			detail: err.message,
			errors: err.failures,
			status: HttpStatus.BadRequest,
			title: 'Validation failure',
		};
	}
	if (err instanceof DomainError) {
		return {
			detail: err.message,
			status: STATUS_BY_KIND[err.kind],
			title: err.code,
		};
	}
	// Thrown by express.json() when the body is not valid JSON
	if (err instanceof SyntaxError) {
		return {
			detail: 'The request body is not valid JSON',
			status: HttpStatus.BadRequest,
			title: 'Malformed request',
		};
	}
	return undefined;
}

// Expected errors become their Problem Details; anything else is a 500
// without leaking internal details to the client.
export function createErrorHandler(logger: Logger): ErrorRequestHandler {
	return (err: unknown, request, response, next) => {
		if (response.headersSent) {
			next(err);
			return;
		}

		const problem = toProblem(err);
		if (problem === undefined) {
			logger.error('Unhandled error', {
				error: err,
				path: request.originalUrl,
			});
			writeProblem(response, {
				...INTERNAL_PROBLEM,
				instance: request.originalUrl,
			});
			return;
		}

		writeProblem(response, { ...problem, instance: request.originalUrl });
	};
}
