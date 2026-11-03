import { defineConfig } from 'vite-plus';

import {
	baseCategories,
	basePlugins,
	baseRules,
	configFilesLint,
} from './tooling/lint/base.ts';
import { expressConfigLint, expressLint } from './tooling/lint/express.ts';
import { reactLint } from './tooling/lint/react.ts';

export default defineConfig({
	fmt: {
		jsxSingleQuote: true,
		objectWrap: 'collapse',
		printWidth: 80,
		quoteProps: 'as-needed',
		semi: true,
		singleAttributePerLine: true,
		singleQuote: true,
		sortPackageJson: true,
		sortTailwindcss: true,
		trailingComma: 'es5',
		useTabs: true,
	},
	lint: {
		categories: baseCategories,
		ignorePatterns: ['**/dist/**', '**/coverage/**', '**/.atl/**'],
		jsPlugins: [
			{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' },
			'eslint-plugin-perfectionist',
		],
		options: { typeAware: true, typeCheck: true },
		overrides: [
			{ files: ['apps/web/**'], ...reactLint },
			{ files: ['apps/api/**'], ...expressLint },
			{ files: ['apps/api/src/config/**'], ...expressConfigLint },
			{ files: ['**/*.config.ts', 'tooling/**'], ...configFilesLint },
		],
		plugins: basePlugins,
		rules: baseRules,
	},
	run: { cache: true },
	staged: { '*': 'vp check --fix' },
});
