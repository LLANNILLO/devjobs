import type { ReactNode } from 'react';

interface ChevronRightProps {
	readonly height: string;
	readonly width: string;
}

export function ChevronRight({ height, width }: ChevronRightProps): ReactNode {
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
			<path d='M9 6l6 6l-6 6' />
		</svg>
	);
}
