import type { CreateJobResponse } from '@devjobs/contracts';

import { Router } from 'express';

import type { JobService } from '../../../ports/inbound/jobService.ts';

import { HttpStatus } from '../../../../../shared/http/httpStatus.ts';
import {
	readJobBody,
	readListJobsQuery,
	withWireFieldNames,
} from './requests.ts';

// Driving adapter: depends on the inbound port, never on concrete handlers
export function createJobsRouter(jobs: JobService): Router {
	const router = Router();

	router.get('/', async (request, response) => {
		response.json(await jobs.listJobs(readListJobsQuery(request.query)));
	});

	router.get('/:id', async (request, response) => {
		response.json(await jobs.getJob({ id: request.params.id }));
	});

	router.post('/', async (request, response) => {
		const id = await withWireFieldNames(async () =>
			jobs.createJob(readJobBody(request.body))
		);
		response
			.status(HttpStatus.Created)
			.location(`${request.baseUrl}/${id}`)
			.json({ id } satisfies CreateJobResponse);
	});

	router.put('/:id', async (request, response) => {
		await withWireFieldNames(async () =>
			jobs.updateJob({ ...readJobBody(request.body), id: request.params.id })
		);
		response.status(HttpStatus.NoContent).end();
	});

	router.patch('/:id', async (request, response) => {
		await withWireFieldNames(async () =>
			jobs.patchJob({ ...readJobBody(request.body), id: request.params.id })
		);
		response.status(HttpStatus.NoContent).end();
	});

	router.delete('/:id', async (request, response) => {
		await jobs.deleteJob({ id: request.params.id });
		response.status(HttpStatus.NoContent).end();
	});

	return router;
}
