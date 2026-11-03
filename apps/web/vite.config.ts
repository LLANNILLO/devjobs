import react from '@vitejs/plugin-react';
import { defineConfig, lazyPlugins } from 'vite-plus';

// https://vite.dev/config/
// Lint and format rules live in the workspace root vite.config.ts
export default defineConfig({
	plugins: lazyPlugins(() => [react()]),
	server: {
		proxy: {
			'/api': {
				rewrite: (path) => path.replace(/^\/api/u, ''),
				target: 'http://localhost:1234',
			},
		},
	},
});
