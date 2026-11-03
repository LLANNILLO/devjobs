import type { FilterName } from './types.ts';

export interface FilterOption {
	readonly label: string;
	readonly value: string;
}

export interface FilterConfig {
	readonly label: string;
	readonly name: FilterName;
	readonly options: readonly FilterOption[];
}

// Values must match the `data` fields in ./data/jobs.json
export const FILTERS: readonly FilterConfig[] = [
	{
		label: 'Tecnología',
		name: 'technology',
		options: [
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
		],
	},
	{
		label: 'Ubicación',
		name: 'location',
		options: [
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
		],
	},
	{
		label: 'Tipo de contrato',
		name: 'contractType',
		options: [
			{ label: 'Indefinido', value: 'permanent' },
			{ label: 'Prácticas', value: 'internship' },
			{ label: 'Duración determinada', value: 'fixed-term' },
		],
	},
	{
		label: 'Nivel de experiencia',
		name: 'experienceLevel',
		options: [
			{ label: 'Junior', value: 'junior' },
			{ label: 'Mid-level', value: 'mid' },
			{ label: 'Senior', value: 'senior' },
			{ label: 'Lead', value: 'lead' },
		],
	},
];
