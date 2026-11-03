import type { ReactNode } from 'react';

interface ChevronLeftProps {
	readonly height: string;
	readonly width: string;
}

export function ChevronLeft({ height, width }: ChevronLeftProps): ReactNode {
	return (
		<svg
			aria-hidden='true'
			fill='none'
			height={height}
			stroke='currentColor'
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth='2'
			viewBox='0 0 24 24'
			width={width}
		>
			<path d='M15 6l-6 6l6 6' />
		</svg>
	);
}
