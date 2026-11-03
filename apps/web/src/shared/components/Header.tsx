import type { ReactNode } from 'react';

import { CodeIcon } from '../icons/CodeIcon.tsx';

export function Header(): ReactNode {
	return (
		<header>
			<h1>
				<CodeIcon />
				DevJobs
			</h1>
			<nav>
				<a href='/'>Inicio</a>
				<a href='/empleos'>Empleos</a>
			</nav>
			<div>
				<a href='/publicar'>Publicar un empleo</a>
			</div>
		</header>
	);
}
