// Strict lint rules for the Express API (apps/api).

import type { LintOverride, LintRules } from './base.ts';

// Express error middleware: (err, req, res, next)
const MAX_PARAMS_ERROR_MIDDLEWARE = 4;

const nodeRules: LintRules = {
	// Restriction
	'node/handle-callback-err': ['error', '^(err|error)$'],
	'node/no-new-require': 'error',
	'node/no-path-concat': 'error',
	'node/no-process-env': 'error',

	// Style
	'node/global-require': 'error',
	'node/no-mixed-requires': 'error',
	'node/no-sync': 'error',

	// Suspicious
	'node/no-exports-assign': 'error',
};

// Base rules that do not fit Express code
const baseOverrides: LintRules = {
	// Error middleware needs the 4-arity signature (err, req, res, next)
	'max-params': ['error', MAX_PARAMS_ERROR_MIDDLEWARE],
	// `express.Router()` is a factory, not a constructor
	'new-cap': [
		'error',
		{ capIsNew: true, capIsNewExceptions: ['Router'], newIsCap: true },
	],
	// Express 5 forwards rejected promises from async handlers to the error middleware
	'oxc/no-async-endpoint-handlers': 'off',
	// Express callbacks (middleware, listen) are not promisifiable
	'promise/prefer-await-to-callbacks': 'off',
	// Express 5 handles the promises returned by async handlers
	'typescript/no-misused-promises': [
		'error',
		{ checksVoidReturn: { arguments: false } },
	],
	// Request/Response are mutable by design
	'typescript/prefer-readonly-parameter-types': 'off',
};

export const expressLint: LintOverride = {
	env: { node: true },
	plugins: ['node'],
	rules: { ...nodeRules, ...baseOverrides },
};

// Only the config module may read process.env
export const expressConfigLint: LintOverride = {
	plugins: ['node'],
	rules: { 'node/no-process-env': 'off' },
};
