import type { ReactNode } from 'react';

import type { FilterOption } from '../filterOptions.ts';
import type { FilterName } from '../types.ts';

interface FilterSelectProps {
	readonly label: string;
	readonly name: FilterName;
	readonly onChange: (name: FilterName, value: string) => void;
	readonly options: readonly FilterOption[];
	readonly value: string;
}

export function FilterSelect({
	label,
	name,
	onChange,
	options,
	value,
}: FilterSelectProps): ReactNode {
	return (
		<select
			aria-label={label}
			name={name}
			onChange={(event) => onChange(name, event.currentTarget.value)}
			value={value}
		>
			<option value=''>{label}</option>
			{options.map((option) => (
				<option
					key={option.value}
					value={option.value}
				>
					{option.label}
				</option>
			))}
		</select>
	);
}
