// Dependency rules of every module, verified on each test run:
// domain -> nothing internal | app -> domain, ports | ports -> never adapters
// adapters/driving and adapters/driven never import each other.

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, test } from 'vite-plus/test';

const MODULES_DIR = path.resolve(import.meta.dirname, '../../src/modules');
const IMPORT_PATTERN = /from\s+'(?<specifier>[^']+)'/gv;

interface SourceFile {
	readonly imports: readonly string[];
	readonly path: string;
}

async function loadSources(): Promise<SourceFile[]> {
	const entries = await readdir(MODULES_DIR, { recursive: true });
	const files = entries.filter((entry) => entry.endsWith('.ts'));
	return Promise.all(
		files.map(async (file) => {
			const absolute = path.join(MODULES_DIR, file);
			const source = await readFile(absolute, 'utf8');
			const imports = [...source.matchAll(IMPORT_PATTERN)].map((match) =>
				path.resolve(path.dirname(absolute), match.groups?.specifier ?? '')
			);
			return { imports, path: absolute };
		})
	);
}

function violations(
	files: readonly SourceFile[],
	layer: string,
	forbidden: readonly string[]
): string[] {
	return files
		.filter((file) => file.path.includes(`/${layer}/`))
		.flatMap((file) =>
			file.imports
				.filter((target) =>
					forbidden.some((name) => target.includes(`/${name}/`))
				)
				.map(
					(target) =>
						`${path.relative(MODULES_DIR, file.path)} -> ${path.relative(MODULES_DIR, target)}`
				)
		);
}

const files = await loadSources();

describe('module layers', () => {
	test('domain depends on no other layer', () => {
		expect(
			violations(files, 'domain', ['app', 'ports', 'adapters'])
		).toStrictEqual([]);
	});

	test('application never depends on adapters', () => {
		expect(violations(files, 'app', ['adapters'])).toStrictEqual([]);
	});

	test('ports never depend on adapters', () => {
		expect(violations(files, 'ports', ['adapters'])).toStrictEqual([]);
	});

	test('driving and driven adapters never import each other', () => {
		expect(violations(files, 'driving', ['driven'])).toStrictEqual([]);
		expect(violations(files, 'driven', ['driving'])).toStrictEqual([]);
	});

	test('the rules actually inspect every module file', () => {
		expect(files.length).toBeGreaterThan(0);
	});
});
