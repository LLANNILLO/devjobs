// One page of a paginated collection
export interface PageDto<TItem> {
	readonly data: readonly TItem[];
	readonly limit: number;
	readonly offset: number;
	readonly total: number;
}
