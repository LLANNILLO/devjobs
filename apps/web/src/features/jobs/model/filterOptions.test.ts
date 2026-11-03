import {
	CONTRACT_TYPES,
	EXPERIENCE_LEVELS,
	TECHNOLOGIES,
	WORK_LOCATIONS,
} from '@devjobs/contracts';
import { describe, expect, test } from 'vite-plus/test';

import type { FilterName } from './types.ts';

import { FILTERS } from './filterOptions.ts';

const CONTRACT_VALUES: Readonly<Record<FilterName, readonly string[]>> = {
	contractType: CONTRACT_TYPES,
	experienceLevel: EXPERIENCE_LEVELS,
	location: WORK_LOCATIONS,
	technology: TECHNOLOGIES,
};

describe('FILTERS', () => {
	test.each(FILTERS)(
		'$name offers every value of the contract once',
		(filter) => {
			const values = filter.options.map((option) => option.value);
			expect(values.toSorted()).toStrictEqual(
				[...CONTRACT_VALUES[filter.name]].toSorted()
			);
		}
	);
});
