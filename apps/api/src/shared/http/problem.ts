// RFC 9457 Problem Details: the single error format of the whole API

import type { ProblemDetail } from '@devjobs/contracts';
import type { Response } from 'express';

import { HttpStatus } from './httpStatus.ts';

export const INTERNAL_PROBLEM: ProblemDetail = {
	detail: 'An unexpected error occurred',
	status: HttpStatus.InternalServerError,
	title: 'Internal Server Error',
};

export function writeProblem(response: Response, problem: ProblemDetail): void {
	response
		.status(problem.status)
		.type('application/problem+json')
		.json(problem);
}
