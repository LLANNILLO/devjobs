import type {
	ContractType,
	ExperienceLevel,
	Technology,
	WorkLocation,
} from '@devjobs/contracts';

import type { FilterName } from './types.ts';

export interface FilterOption<TValue extends string = string> {
	readonly label: string;
	readonly value: TValue;
}

export interface FilterConfig {
	readonly label: string;
	readonly name: FilterName;
	readonly options: readonly FilterOption[];
}

// Values are typed by @devjobs/contracts, so an unknown value does not compile.
// filterOptions.test.ts checks that no contract value is missing.
// The array order is the order shown in the select.

const TECHNOLOGY_OPTIONS: ReadonlyArray<FilterOption<Technology>> = [
	{ label: 'JavaScript', value: 'javascript' },
	{ label: 'Python', value: 'python' },
	{ label: 'React', value: 'react' },
	{ label: 'Node.js', value: 'node' },
	{ label: 'Mobile', value: 'mobile' },
	{ label: 'Java', value: 'java' },
	{ label: 'C#', value: 'csharp' },
	{ label: 'C', value: 'c' },
	{ label: 'C++', value: 'c++' },
	{ label: 'Ruby', value: 'ruby' },
	{ label: 'PHP', value: 'php' },
];

const LOCATION_OPTIONS: ReadonlyArray<FilterOption<WorkLocation>> = [
	{ label: 'Remoto', value: 'remoto' },
	{ label: 'Ciudad de México', value: 'cdmx' },
	{ label: 'Guadalajara', value: 'guadalajara' },
	{ label: 'Monterrey', value: 'monterrey' },
	{ label: 'Barcelona', value: 'barcelona' },
	{ label: 'Madrid', value: 'madrid' },
	{ label: 'Valencia', value: 'valencia' },
	{ label: 'Buenos Aires', value: 'bsas' },
	{ label: 'Bogotá', value: 'bogota' },
	{ label: 'Lima', value: 'lima' },
	{ label: 'Santiago', value: 'santiago' },
];

const CONTRACT_TYPE_OPTIONS: ReadonlyArray<FilterOption<ContractType>> = [
	{ label: 'Indefinido', value: 'permanent' },
	{ label: 'Prácticas', value: 'internship' },
	{ label: 'Duración determinada', value: 'fixed-term' },
];

const EXPERIENCE_LEVEL_OPTIONS: ReadonlyArray<FilterOption<ExperienceLevel>> = [
	{ label: 'Junior', value: 'junior' },
	{ label: 'Mid-level', value: 'mid' },
	{ label: 'Senior', value: 'senior' },
	{ label: 'Lead', value: 'lead' },
];

export const FILTERS: readonly FilterConfig[] = [
	{ label: 'Tecnología', name: 'technology', options: TECHNOLOGY_OPTIONS },
	{ label: 'Ubicación', name: 'location', options: LOCATION_OPTIONS },
	{
		label: 'Tipo de contrato',
		name: 'contractType',
		options: CONTRACT_TYPE_OPTIONS,
	},
	{
		label: 'Nivel de experiencia',
		name: 'experienceLevel',
		options: EXPERIENCE_LEVEL_OPTIONS,
	},
];
