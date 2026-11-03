import { DomainError } from '../../../shared/errors/domainError.ts';

export const JobErrors = {
	notFound: (id: string): DomainError =>
		new DomainError({
			code: 'Jobs.NotFound',
			kind: 'notFound',
			message: `The job with the identifier ${id} was not found`,
		}),
};
