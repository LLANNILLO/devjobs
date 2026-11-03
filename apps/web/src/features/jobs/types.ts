export interface JobData {
	readonly contractType: string;
	readonly experienceLevel: string;
	readonly location: string;
	readonly technology: readonly string[];
}

export interface Job {
	readonly data: JobData;
	readonly descripcion: string;
	readonly empresa: string;
	readonly id: string;
	readonly titulo: string;
	readonly ubicacion: string;
}

export interface JobFilters {
	readonly contractType: string;
	readonly experienceLevel: string;
	readonly location: string;
	readonly technology: string;
}

export type FilterName = keyof JobFilters;
