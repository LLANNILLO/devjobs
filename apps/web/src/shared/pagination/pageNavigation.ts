// Navigation metadata for server-side pagination: the API returns one page
// and the total, the UI only needs to know where it can move.

export interface PageNavigation {
	readonly nextPage: null | number;
	readonly page: number;
	readonly prevPage: null | number;
	readonly totalPages: number;
}

export interface PageNavigationInput {
	readonly page: number;
	readonly perPage: number;
	readonly total: number;
}

// Out-of-range pages are clamped so a stale page number never breaks the nav
export function getPageNavigation({
	page,
	perPage,
	total,
}: PageNavigationInput): PageNavigation {
	const safePerPage = Math.max(1, Math.trunc(perPage));
	const totalPages = Math.max(1, Math.ceil(total / safePerPage));
	const currentPage = Math.min(Math.max(1, Math.trunc(page)), totalPages);

	return {
		nextPage: currentPage < totalPages ? currentPage + 1 : null,
		page: currentPage,
		prevPage: currentPage > 1 ? currentPage - 1 : null,
		totalPages,
	};
}

export function pageToOffset(page: number, perPage: number): number {
	return (Math.max(1, Math.trunc(page)) - 1) * perPage;
}
