import { describe, expect, test } from 'vite-plus/test';

import { EMPTY_FILTERS } from '../model/jobsSearch.ts';
import { buildJobsQuery } from './jobsApi.ts';

const PER_PAGE = 3;

describe('buildJobsQuery', () => {
	test('sends only pagination when no filter is active', () => {
		expect(
			buildJobsQuery({
				filters: EMPTY_FILTERS,
				page: 1,
				perPage: PER_PAGE,
				text: ' ',
			})
		).toBe('limit=3&offset=0');
	});

	test('sends active filters, text and the offset of the page', () => {
		const query = buildJobsQuery({
			filters: { ...EMPTY_FILTERS, location: 'remoto', technology: 'react' },
			page: 3,
			perPage: PER_PAGE,
			text: 'senior dev',
		});
		expect(Object.fromEntries(new URLSearchParams(query))).toStrictEqual({
			limit: '3',
			location: 'remoto',
			offset: '6',
			technology: 'react',
			text: 'senior dev',
		});
	});
});
