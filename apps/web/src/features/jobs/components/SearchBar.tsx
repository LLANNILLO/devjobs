import type { ReactNode } from 'react';

import { SearchIcon } from '../../../shared/icons/SearchIcon.tsx';

interface SearchBarProps {
	readonly onChange: (value: string) => void;
	readonly value: string;
}

export function SearchBar({ onChange, value }: SearchBarProps): ReactNode {
	return (
		<div className='search-bar'>
			<SearchIcon />
			<input
				aria-label='Buscar trabajos, empresas o habilidades'
				name='search'
				onChange={(event) => onChange(event.currentTarget.value)}
				placeholder='Buscar trabajos, empresas o habilidades'
				type='text'
				value={value}
			/>
		</div>
	);
}
