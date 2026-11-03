import { describe, expect, test } from 'vite-plus/test';

import { paginate } from './paginate.ts';

const ITEMS = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
const PER_PAGE = 3;
const LAST_PAGE = 3;

describe('paginate', () => {
	test('returns the requested page slice with its navigation metadata', () => {
		expect(paginate(ITEMS, 2, PER_PAGE)).toStrictEqual({
			data: ['d', 'e', 'f'],
			meta: {
				from: 4,
				nextPage: 3,
				page: 2,
				perPage: 3,
				prevPage: 1,
				to: 6,
				total: 7,
				totalPages: 3,
			},
		});
	});

	test('returns a shorter last page and no next page', () => {
		const { data, meta } = paginate(ITEMS, LAST_PAGE, PER_PAGE);

		expect(data).toStrictEqual(['g']);
		expect(meta.nextPage).toBeNull();
		expect(meta.to).toBe(ITEMS.length);
	});

	test('has no previous page on the first page', () => {
		expect(paginate(ITEMS, 1, PER_PAGE).meta.prevPage).toBeNull();
	});

	test('clamps an out-of-range page to the last one', () => {
		const outOfRangePage = 99;

		expect(paginate(ITEMS, outOfRangePage, PER_PAGE).meta.page).toBe(LAST_PAGE);
	});

	test('returns one empty page for an empty list', () => {
		expect(paginate([], 1, PER_PAGE)).toStrictEqual({
			data: [],
			meta: {
				from: null,
				nextPage: null,
				page: 1,
				perPage: 3,
				prevPage: null,
				to: null,
				total: 0,
				totalPages: 1,
			},
		});
	});
});
