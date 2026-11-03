import { defineConfig } from 'vite-plus';

export default defineConfig({
	pack: {
		deps: {
			// Resolve external dependency subpaths [tsdown <0.23 compatibility].
			// Remove to preserve subpath imports as written (the new default).
			// https://tsdown.dev/options/dependencies#deps-resolvedepsubpath
			resolveDepSubpath: true,
		},
		dts: {},
		exports: true,
	},
});
