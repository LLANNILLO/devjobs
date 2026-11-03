import type { ReactNode } from 'react';

import type { PageNavigation } from '../../../shared/pagination/pageNavigation.ts';

import { ChevronLeft } from '../../../shared/icons/ChevronLeft.tsx';
import { ChevronRight } from '../../../shared/icons/ChevronRight.tsx';
import { PageLink } from './PageLink.tsx';

interface JobPaginateProps {
	readonly navigation: PageNavigation;
	readonly onPageChange: (page: number) => void;
}

export function JobPaginate({
	navigation,
	onPageChange,
}: JobPaginateProps): ReactNode {
	const { nextPage, page: activePage, prevPage, totalPages } = navigation;

	// A single page needs no navigation
	if (totalPages <= 1) {
		return null;
	}

	const pageNumbers = Array.from(
		{ length: totalPages },
		(_, index) => index + 1
	);

	// Arrows pass null when there is nowhere to go
	const navigate = (page: null | number): void => {
		if (page === null) {
			return;
		}
		onPageChange(page);
	};

	return (
		<nav
			aria-label='Paginación'
			className='pagination'
		>
			<button
				aria-label='Página anterior'
				disabled={prevPage === null}
				onClick={() => navigate(prevPage)}
				type='button'
			>
				<ChevronLeft
					height='16px'
					width='16px'
				/>
			</button>
			{pageNumbers.map((pageNumber) => (
				<PageLink
					isActive={pageNumber === activePage}
					key={pageNumber}
					onSelect={navigate}
					page={pageNumber}
				/>
			))}
			<button
				aria-label='Página siguiente'
				disabled={nextPage === null}
				onClick={() => navigate(nextPage)}
				type='button'
			>
				<ChevronRight
					height='16px'
					width='16px'
				/>
			</button>
		</nav>
	);
}
