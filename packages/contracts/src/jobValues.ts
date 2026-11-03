// Allowed values of a job. Single source of truth for the API domain and the
// web filters.

export const TECHNOLOGIES = [
	'c',
	'c++',
	'csharp',
	'java',
	'javascript',
	'mobile',
	'node',
	'php',
	'python',
	'react',
	'ruby',
] as const;

export const WORK_LOCATIONS = [
	'barcelona',
	'bogota',
	'bsas',
	'cdmx',
	'guadalajara',
	'lima',
	'madrid',
	'monterrey',
	'remoto',
	'santiago',
	'valencia',
] as const;

export const CONTRACT_TYPES = [
	'fixed-term',
	'internship',
	'permanent',
] as const;

export const EXPERIENCE_LEVELS = ['junior', 'lead', 'mid', 'senior'] as const;

export type ContractType = (typeof CONTRACT_TYPES)[number];
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];
export type Technology = (typeof TECHNOLOGIES)[number];
export type WorkLocation = (typeof WORK_LOCATIONS)[number];
