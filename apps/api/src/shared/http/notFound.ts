import type { Request, Response } from 'express';

import { HttpStatus } from './httpStatus.ts';
import { writeProblem } from './problem.ts';

export function notFoundHandler(request: Request, response: Response): void {
	writeProblem(response, {
		detail: `No route matches ${request.method} ${request.originalUrl}`,
		instance: request.originalUrl,
		status: HttpStatus.NotFound,
		title: 'Not Found',
	});
}
