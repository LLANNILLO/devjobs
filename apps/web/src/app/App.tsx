import type { ReactNode } from 'react';

import { JobsPage } from '../features/jobs/components/JobsPage.tsx';
import { Footer } from '../shared/components/Footer.tsx';
import { Header } from '../shared/components/Header.tsx';

export function App(): ReactNode {
	return (
		<>
			<Header />
			<JobsPage />
			<Footer />
		</>
	);
}
