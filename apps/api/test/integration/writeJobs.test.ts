import type {
	CreateJobResponse,
	GetJobResponse,
	JobRequest,
	ListJobsResponse,
	ProblemDetail,
} from '@devjobs/contracts';

import { afterEach, beforeEach, describe, expect, test } from 'vite-plus/test';

import type { TestServer } from './testServer.ts';

import { HttpStatus } from '../../src/shared/http/httpStatus.ts';
import { jsonBody, readJson, startTestServer } from './testServer.ts';

const NEW_JOB: JobRequest = {
	data: {
		contractType: 'internship',
		experienceLevel: 'junior',
		location: 'lima',
		technology: ['python'],
	},
	descripcion: 'Data internship',
	empresa: 'Acme',
	titulo: 'Data Intern',
	ubicacion: 'Lima, Peru',
};

let server: TestServer;

beforeEach(async () => {
	server = await startTestServer();
});

afterEach(async () => {
	await server.close();
});

async function createJob(): Promise<string> {
	const response = await server.request('/jobs', jsonBody('POST', NEW_JOB));
	expect(response.status).toBe(HttpStatus.Created);
	const { id } = await readJson<CreateJobResponse>(response);
	expect(response.headers.get('location')).toBe(`/jobs/${id}`);
	return id;
}

async function getJob(id: string): Promise<GetJobResponse> {
	const response = await server.request(`/jobs/${id}`);
	expect(response.status).toBe(HttpStatus.Ok);
	return readJson<GetJobResponse>(response);
}

async function errorFields(response: Response): Promise<string[]> {
	expect(response.status).toBe(HttpStatus.BadRequest);
	const problem = await readJson<ProblemDetail>(response);
	return (problem.errors ?? []).map((failure) => failure.field);
}

describe('job lifecycle', () => {
	test('creates a job that can be read back and found by filters', async () => {
		const id = await createJob();
		expect(await getJob(id)).toStrictEqual({ ...NEW_JOB, id });
		const list = await server.request(
			'/jobs?location=lima&contractType=internship'
		);
		const page = await readJson<ListJobsResponse>(list);
		expect(page.data.map((job) => job.id)).toContain(id);
	});

	test('replaces a job with PUT', async () => {
		const id = await createJob();
		const replacement = { ...NEW_JOB, titulo: 'Data Engineer' };
		const response = await server.request(
			`/jobs/${id}`,
			jsonBody('PUT', replacement)
		);
		expect(response.status).toBe(HttpStatus.NoContent);
		expect(await getJob(id)).toStrictEqual({ ...replacement, id });
	});

	test('patches only the provided fields, including nested data', async () => {
		const id = await createJob();
		const patch = { data: { experienceLevel: 'mid' }, titulo: 'Data Analyst' };
		const response = await server.request(
			`/jobs/${id}`,
			jsonBody('PATCH', patch)
		);
		expect(response.status).toBe(HttpStatus.NoContent);
		expect(await getJob(id)).toStrictEqual({
			...NEW_JOB,
			data: { ...NEW_JOB.data, experienceLevel: 'mid' },
			id,
			titulo: 'Data Analyst',
		});
	});

	test('deletes a job', async () => {
		const id = await createJob();
		const response = await server.request(`/jobs/${id}`, { method: 'DELETE' });
		expect(response.status).toBe(HttpStatus.NoContent);
		const deleted = await server.request(`/jobs/${id}`);
		expect(deleted.status).toBe(HttpStatus.NotFound);
	});
});

describe('errors', () => {
	test('reports every invalid field with its wire name', async () => {
		const body = {
			...NEW_JOB,
			data: { ...NEW_JOB.data, technology: [] },
			titulo: ' ',
		};
		const response = await server.request('/jobs', jsonBody('POST', body));
		expect(await errorFields(response)).toStrictEqual([
			'titulo',
			'data.technology',
		]);
	});

	test('rejects wrongly typed fields on PATCH instead of ignoring them', async () => {
		const id = await createJob();
		const response = await server.request(
			`/jobs/${id}`,
			jsonBody('PATCH', { titulo: 5 })
		);
		expect(await errorFields(response)).toStrictEqual(['titulo']);
		expect(await getJob(id)).toStrictEqual({ ...NEW_JOB, id });
	});

	test('returns 404 problem details for unknown jobs and routes', async () => {
		const unknownJob = await server.request(
			'/jobs/missing',
			jsonBody('PUT', NEW_JOB)
		);
		const unknownRoute = await server.request('/nope');
		expect(unknownJob.status).toBe(HttpStatus.NotFound);
		expect(await unknownJob.json()).toMatchObject({ title: 'Jobs.NotFound' });
		expect(unknownRoute.status).toBe(HttpStatus.NotFound);
	});

	test('returns 400 for malformed JSON', async () => {
		const response = await server.request('/jobs', {
			body: '{bad',
			headers: { 'content-type': 'application/json' },
			method: 'POST',
		});
		expect(response.status).toBe(HttpStatus.BadRequest);
	});
});
