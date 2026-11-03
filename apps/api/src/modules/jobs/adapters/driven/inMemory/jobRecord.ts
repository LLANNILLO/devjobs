import type {
	ContractType,
	ExperienceLevel,
	Technology,
	WorkLocation,
} from '../../../domain/jobAttributes.ts';

// Persistence shape, identical to the entries of ./jobs.json
export interface JobRecord {
	readonly data: {
		readonly contractType: ContractType;
		readonly experienceLevel: ExperienceLevel;
		readonly location: WorkLocation;
		readonly technology: readonly Technology[];
	};
	readonly descripcion: string;
	readonly empresa: string;
	readonly id: string;
	readonly titulo: string;
	readonly ubicacion: string;
}
