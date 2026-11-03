import { describe, expect, test } from 'vite-plus/test';

import { getPageNavigation, pageToOffset } from './pageNavigation.ts';

const PER_PAGE = 3;
const TOTAL = 7;
const LAST_PAGE = 3;
const LAST_PAGE_OFFSET = 6;

describe('getPageNavigation', () => {
	test('returns the previous and next pages around the current one', () => {
		expect(
			getPageNavigation({ page: 2, perPage: PER_PAGE, total: TOTAL })
		).toStrictEqual({ nextPage: 3, page: 2, prevPage: 1, totalPages: 3 });
	});

	test('has no next page on the last page', () => {
		expect(
			getPageNavigation({ page: LAST_PAGE, perPage: PER_PAGE, total: TOTAL })
				.nextPage
		).toBeNull();
	});

	test('has no previous page on the first page', () => {
		expect(
			getPageNavigation({ page: 1, perPage: PER_PAGE, total: TOTAL }).prevPage
		).toBeNull();
	});

	test('clamps out-of-range pages', () => {
		expect(
			getPageNavigation({ page: 99, perPage: PER_PAGE, total: TOTAL }).page
		).toBe(LAST_PAGE);
		expect(
			getPageNavigation({ page: -1, perPage: PER_PAGE, total: TOTAL }).page
		).toBe(1);
	});

	test('keeps a single page when there are no results', () => {
		expect(
			getPageNavigation({ page: 1, perPage: PER_PAGE, total: 0 })
		).toStrictEqual({ nextPage: null, page: 1, prevPage: null, totalPages: 1 });
	});
});

describe('pageToOffset', () => {
	test('converts a 1-based page into an item offset', () => {
		expect(pageToOffset(1, PER_PAGE)).toBe(0);
		expect(pageToOffset(LAST_PAGE, PER_PAGE)).toBe(LAST_PAGE_OFFSET);
	});
});
