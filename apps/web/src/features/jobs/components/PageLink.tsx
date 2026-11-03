import type { ReactNode } from 'react';

interface PageLinkProps {
	readonly isActive: boolean;
	readonly onSelect: (page: number) => void;
	readonly page: number;
}

export function PageLink({
	isActive,
	onSelect,
	page,
}: PageLinkProps): ReactNode {
	return (
		<button
			aria-current={isActive ? 'page' : undefined}
			className={isActive ? 'is-active' : undefined}
			onClick={() => onSelect(page)}
			type='button'
		>
			{page}
		</button>
	);
}
