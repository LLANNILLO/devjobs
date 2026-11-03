import type { ListJobsResponse, ProblemDetail } from '@devjobs/contracts';

import { afterEach, beforeEach, describe, expect, test } from 'vite-plus/test';

import type { TestServer } from './testServer.ts';

import { HttpStatus } from '../../src/shared/http/httpStatus.ts';
import { readJson, startTestServer } from './testServer.ts';

const SEED_TOTAL = 15;
const SECOND_PAGE_OFFSET = 10;
const SECOND_PAGE_SIZE = 5;

let server: TestServer;

beforeEach(async () => {
	server = await startTestServer();
});

afterEach(async () => {
	await server.close();
});

async function listJobs(search: string): Promise<ListJobsResponse> {
	const response = await server.request(`/jobs${search}`);
	expect(response.status).toBe(HttpStatus.Ok);
	return readJson<ListJobsResponse>(response);
}

describe('GET /jobs', () => {
	test('returns the first page with the total of matching jobs', async () => {
		const page = await listJobs('');
		expect(page.total).toBe(SEED_TOTAL);
		expect(page.data).toHaveLength(SECOND_PAGE_OFFSET);
		expect(page).toMatchObject({ limit: 10, offset: 0 });
	});

	test('paginates with limit and offset', async () => {
		const page = await listJobs('?limit=10&offset=10');
		expect(page.data).toHaveLength(SECOND_PAGE_SIZE);
		expect(page.total).toBe(SEED_TOTAL);
	});

	test('searches text in title and company, case insensitive', async () => {
		const byCompany = await listJobs('?text=TECH%20SOLUTIONS');
		const byTitle = await listJobs('?text=analista');
		expect(
			byCompany.data.every((job) => job.empresa === 'Tech Solutions Inc.')
		).toBe(true);
		expect(byCompany.total).toBeGreaterThan(0);
		expect(
			byTitle.data.every((job) => job.titulo.toLowerCase().includes('analista'))
		).toBe(true);
		expect(byTitle.total).toBeGreaterThan(0);
	});

	test('combines every filter', async () => {
		const page = await listJobs(
			'?technology=react&location=remoto&contractType=permanent&experienceLevel=senior'
		);
		expect(page.total).toBeGreaterThan(0);
		for (const job of page.data) {
			expect(job.data.technology).toContain('react');
			expect(job.data).toMatchObject({
				contractType: 'permanent',
				experienceLevel: 'senior',
				location: 'remoto',
			});
		}
	});

	test('treats empty filters as "any value"', async () => {
		const page = await listJobs('?technology=&location=&text=');
		expect(page.total).toBe(SEED_TOTAL);
	});

	test('rejects unknown filter values and invalid pagination', async () => {
		const response = await server.request(
			'/jobs?technology=cobol&limit=0&offset=-1'
		);
		expect(response.status).toBe(HttpStatus.BadRequest);
		expect(response.headers.get('content-type')).toContain(
			'application/problem+json'
		);
		const problem = await readJson<ProblemDetail>(response);
		expect(
			(problem.errors ?? []).map((failure) => failure.field)
		).toStrictEqual(['technology', 'limit', 'offset']);
	});
});
