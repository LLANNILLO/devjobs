export interface PaginationMeta {
	readonly from: null | number;
	readonly nextPage: null | number;
	readonly page: number;
	readonly perPage: number;
	readonly prevPage: null | number;
	readonly to: null | number;
	readonly total: number;
	readonly totalPages: number;
}

export interface Paginated<Item> {
	readonly data: Item[];
	readonly meta: PaginationMeta;
}

// Out-of-range pages are clamped, so a stale page number after filtering still shows content
export function paginate<Item>(
	items: readonly Item[],
	page: number,
	perPage: number
): Paginated<Item> {
	const safePerPage = Math.max(1, Math.trunc(perPage));
	const total = items.length;
	const totalPages = Math.max(1, Math.ceil(total / safePerPage));
	const currentPage = Math.min(Math.max(1, Math.trunc(page)), totalPages);
	const startIndex = (currentPage - 1) * safePerPage;
	const endIndex = Math.min(startIndex + safePerPage, total);
	const isEmpty = total === 0;

	return {
		data: items.slice(startIndex, endIndex),
		meta: {
			from: isEmpty ? null : startIndex + 1,
			nextPage: currentPage < totalPages ? currentPage + 1 : null,
			page: currentPage,
			perPage: safePerPage,
			prevPage: currentPage > 1 ? currentPage - 1 : null,
			to: isEmpty ? null : endIndex,
			total,
			totalPages,
		},
	};
}
