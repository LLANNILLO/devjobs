import type { PageDto } from '@devjobs/contracts';

export const DEFAULT_PAGE_LIMIT = 10;
export const MAX_PAGE_LIMIT = 100;

export interface PageRequest {
	readonly limit: number;
	readonly offset: number;
}

export function paginate<TItem>(
	items: readonly TItem[],
	request: PageRequest
): PageDto<TItem> {
	return {
		data: items.slice(request.offset, request.offset + request.limit),
		limit: request.limit,
		offset: request.offset,
		total: items.length,
	};
}
