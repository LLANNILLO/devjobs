import { describe, expect, test } from 'vite-plus/test';

import type { Job, JobFilters } from './types.ts';

import { filterJobs } from './filterJobs.ts';

const EMPTY_FILTERS: JobFilters = {
	contractType: '',
	experienceLevel: '',
	location: '',
	technology: '',
};

const reactJob: Job = {
	data: {
		contractType: 'permanent',
		experienceLevel: 'senior',
		location: 'remoto',
		technology: ['react', 'javascript'],
	},
	descripcion: 'Frontend role',
	empresa: 'Tech Solutions Inc.',
	id: 'react-job',
	titulo: 'Desarrollador Frontend',
	ubicacion: 'Remoto',
};

const pythonJob: Job = {
	data: {
		contractType: 'internship',
		experienceLevel: 'junior',
		location: 'madrid',
		technology: ['python'],
	},
	descripcion: 'Data role',
	empresa: 'Data Driven Co.',
	id: 'python-job',
	titulo: 'Analista de Datos',
	ubicacion: 'Madrid',
};

const JOBS = [reactJob, pythonJob];

describe('filterJobs', () => {
	test('returns every job when no filter or query is set', () => {
		expect(filterJobs(JOBS, EMPTY_FILTERS, '')).toStrictEqual(JOBS);
	});

	test('keeps jobs whose technology list includes the selected technology', () => {
		const filters = { ...EMPTY_FILTERS, technology: 'python' };

		expect(filterJobs(JOBS, filters, '')).toStrictEqual([pythonJob]);
	});

	test('matches location, contract type and experience level exactly', () => {
		const filters = {
			contractType: 'permanent',
			experienceLevel: 'senior',
			location: 'remoto',
			technology: '',
		};

		expect(filterJobs(JOBS, filters, '')).toStrictEqual([reactJob]);
	});

	test('matches the query against title and company, ignoring case and spaces', () => {
		expect(filterJobs(JOBS, EMPTY_FILTERS, '  DATA driven ')).toStrictEqual([
			pythonJob,
		]);
		expect(filterJobs(JOBS, EMPTY_FILTERS, 'frontend')).toStrictEqual([
			reactJob,
		]);
	});

	test('returns no jobs when filters and query do not match together', () => {
		const filters = { ...EMPTY_FILTERS, technology: 'react' };

		expect(filterJobs(JOBS, filters, 'analista')).toStrictEqual([]);
	});
});
