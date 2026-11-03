// Strict lint rules shared by every package in the workspace.
// Package-specific rules live in ./react.ts and ./express.ts.

import type { UserConfig } from 'vite-plus';

type LintConfig = NonNullable<UserConfig['lint']>;
export type LintRules = NonNullable<LintConfig['rules']>;
export type LintOverride = Omit<
	NonNullable<LintConfig['overrides']>[number],
	'files'
>;

const MAX_COMPLEXITY = 10;
const MAX_DEPTH = 3;
const MAX_FILE_LINES = 500;
const MAX_FUNCTION_LINES = 60;
const MAX_NESTED_CALLBACKS = 3;
const MAX_NESTED_CALLS = 3;
const MAX_PARAMS = 3;
const MAX_STATEMENTS = 10;

// Typescript const linting rule
const MIN_DESCRP_LENGTH = 10;

export const basePlugins: NonNullable<LintConfig['plugins']> = [
	'typescript',
	'oxc',
	'unicorn',
	'import',
	'promise',
];

export const baseCategories: NonNullable<LintConfig['categories']> = {
	correctness: 'error',
	perf: 'error',
	suspicious: 'error',
};

// Core JavaScript rules (eslint)
const eslintRules: LintRules = {
	// Pedantic
	'array-callback-return': ['error', { checkForEach: true }],
	eqeqeq: ['error', 'always'],
	'max-depth': ['error', MAX_DEPTH],
	'max-lines': [
		'error',
		{ max: MAX_FILE_LINES, skipBlankLines: true, skipComments: true },
	],
	'max-lines-per-function': [
		'error',
		{ max: MAX_FUNCTION_LINES, skipBlankLines: true, skipComments: true },
	],
	'max-nested-callbacks': ['error', MAX_NESTED_CALLBACKS],
	'no-else-return': ['error', { allowElseIf: false }],
	'no-lonely-if': 'error',
	'no-loop-func': 'error',
	'no-negated-condition': 'error',
	'no-self-compare': 'error',
	'no-throw-literal': 'error',
	'no-useless-return': 'error',
	radix: 'error',

	// Perf
	'no-await-in-loop': 'error',
	'no-useless-call': 'error',

	// Restriction
	complexity: ['error', MAX_COMPLEXITY],
	'default-case': ['error', { commentPattern: String.raw`^no\sdefault` }],
	'no-alert': 'error',
	'no-bitwise': 'error',
	'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
	'no-empty-function': 'error',
	'no-eq-null': 'error',
	'no-param-reassign': ['error', { props: true }],
	'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
	'no-sequences': 'error',
	'no-use-before-define': ['error', { functions: false }],
	'no-var': 'error',
	'no-void': ['error', { allowAsStatement: true }],

	// Style
	'arrow-body-style': [
		'error',
		'as-needed',
		{ requireReturnForObjectLiteral: true },
	],
	'capitalized-comments': [
		'error',
		'always',
		{ ignoreConsecutiveComments: true, ignoreInlineComments: true },
	],
	curly: ['error', 'all'],
	'default-case-last': 'error',
	'default-param-last': 'error',
	'func-names': ['error', 'as-needed'],
	'grouped-accessor-pairs': 'error',
	'guard-for-in': 'error',
	'id-length': ['error', { exceptions: ['_', 'i', 'j'], min: 2 }],
	'logical-assignment-operators': ['error', 'always'],
	'max-params': ['error', MAX_PARAMS],
	'max-statements': ['error', { max: MAX_STATEMENTS }],
	'new-cap': ['error', { capIsNew: true, newIsCap: true }],
	'no-implicit-coercion': 'error',
	'no-label-var': 'error',
	'no-magic-numbers': [
		'error',
		{
			enforceConst: true,
			ignore: [-1, 0, 1, 2],
			ignoreArrayIndexes: true,
			ignoreDefaultValues: true,
		},
	],
	'no-multi-assign': 'error',
	'no-multi-str': 'error',
	'no-nested-ternary': 'error',
	'no-return-assign': ['error', 'always'],
	'no-script-url': 'error',
	'no-template-curly-in-string': 'error',
	'no-useless-computed-key': 'error',
	'object-shorthand': ['error', 'always'],
	'prefer-arrow-callback': 'error',
	'prefer-const': 'error',
	'prefer-exponentiation-operator': 'error',
	'prefer-object-has-own': 'error',
	'prefer-object-spread': 'error',
	'prefer-rest-params': 'error',
	'prefer-spread': 'error',
	'prefer-template': 'error',
	yoda: 'error',

	// Suspicious
	'block-scoped-var': 'error',
	'no-shadow': 'error',
	'no-unneeded-ternary': 'error',
	'no-useless-concat': 'error',
	'no-useless-constructor': 'error',

	// Correctness (already enabled by the category, listed for visibility)
	'no-unused-vars': [
		'error',
		{
			argsIgnorePattern: '^_',
			caughtErrorsIgnorePattern: '^_',
			varsIgnorePattern: '^_',
		},
	],
	'no-useless-rename': 'error',
};

// TypeScript rules, close to typescript-eslint strict-type-checked + stylistic-type-checked.
// Only rules whose defaults do not fit the codebase carry options.
const typescriptRules: LintRules = {
	// Nursery
	'typescript/no-unnecessary-condition': [
		'error',
		{
			allowConstantLoopConditions: 'only-allowed-literals',
			checkTypePredicates: true,
		},
	],
	'typescript/prefer-optional-chain': 'error',

	// Pedantic
	'typescript/ban-ts-comment': [
		'error',
		{
			minimumDescriptionLength: MIN_DESCRP_LENGTH,
			'ts-check': false,
			'ts-expect-error': {
				descriptionFormat: String.raw`^: TS\d+ because .+$`,
			},
			'ts-ignore': true,
			'ts-nocheck': { descriptionFormat: String.raw`^ -- TODO\(GH-\d+\)` },
		},
	],
	'typescript/no-confusing-void-expression': 'error',
	'typescript/no-deprecated': 'error',
	'typescript/no-misused-promises': 'error',
	'typescript/no-mixed-enums': 'error',
	'typescript/no-unsafe-argument': 'error',
	'typescript/no-unsafe-assignment': 'error',
	'typescript/no-unsafe-call': 'error',
	'typescript/no-unsafe-function-type': 'error',
	'typescript/no-unsafe-member-access': 'error',
	'typescript/no-unsafe-return': 'error',
	'typescript/only-throw-error': 'error',
	'typescript/prefer-enum-initializers': 'error',
	'typescript/prefer-includes': 'error',
	'typescript/prefer-nullish-coalescing': 'error',
	'typescript/prefer-promise-reject-errors': 'error',
	'typescript/prefer-readonly-parameter-types': 'error',
	'typescript/related-getter-setter-pairs': 'error',
	'typescript/require-await': 'error',
	'typescript/restrict-plus-operands': 'error',
	'typescript/return-await': ['error', 'in-try-catch'],
	'typescript/strict-boolean-expressions': 'error',
	'typescript/strict-void-return': 'error',
	'typescript/switch-exhaustiveness-check': 'error',

	// Restriction
	'typescript/explicit-module-boundary-types': 'error',
	'typescript/no-empty-object-type': 'error',
	'typescript/no-explicit-any': 'error',
	'typescript/no-import-type-side-effects': 'error',
	'typescript/no-non-null-assertion': 'error',
	'typescript/promise-function-async': 'error',
	'typescript/use-unknown-in-catch-callback-variable': 'error',

	// Style
	'typescript/array-type': ['error', { default: 'array-simple' }],
	'typescript/consistent-type-assertions': [
		'error',
		{ assertionStyle: 'as', objectLiteralTypeAssertions: 'never' },
	],
	'typescript/consistent-type-definitions': ['error', 'interface'],
	'typescript/consistent-type-exports': 'error',
	'typescript/consistent-type-imports': 'error',
	'typescript/dot-notation': 'error',
	'typescript/method-signature-style': ['error', 'property'],
	'typescript/no-inferrable-types': 'error',
	'typescript/prefer-find': 'error',
	'typescript/prefer-for-of': 'error',
	'typescript/prefer-readonly': 'error',
	'typescript/prefer-reduce-type-parameter': 'error',
	'typescript/prefer-string-starts-ends-with': 'error',

	// Suspicious
	'typescript/no-unnecessary-boolean-literal-compare': 'error',
	'typescript/no-unnecessary-template-expression': 'error',
	'typescript/no-unnecessary-type-arguments': 'error',
	'typescript/no-unnecessary-type-assertion': 'error',
	'typescript/no-unsafe-enum-comparison': 'error',
	'typescript/no-unsafe-type-assertion': 'error',

	// Correctness (already enabled by the category, listed for visibility)
	'typescript/await-thenable': 'error',
	'typescript/no-floating-promises': 'error',
	'typescript/no-misused-spread': 'error',
	'typescript/restrict-template-expressions': 'error',
	'typescript/unbound-method': 'error',
};

// Modern JavaScript idioms (unicorn)
const unicornRules: LintRules = {
	// Nursery
	'unicorn/no-useless-iterator-to-array': 'error',

	//Pedantic
	'unicorn/consistent-assert': 'warn',
	'unicorn/consistent-empty-array-spread': 'warn',
	'unicorn/escape-case': 'warn',
	'unicorn/explicit-length-check': 'error',
	'unicorn/new-for-builtins': 'error',
	'unicorn/no-array-callback-reference': 'error',
	'unicorn/no-hex-escape': 'warn',
	'unicorn/no-immediate-mutation': 'error',
	'unicorn/no-instanceof-array': 'error',
	'unicorn/no-negation-in-equality-check': 'error',
	'unicorn/no-new-buffer': 'error',
	'unicorn/no-object-as-default-parameter': 'error',
	'unicorn/no-static-only-class': 'warn',
	'unicorn/no-this-assignment': 'error',
	'unicorn/no-typeof-undefined': 'warn',
	'unicorn/no-unnecessary-array-flat-depth': 'warn',
	'unicorn/no-unnecessary-array-splice-count': 'error',
	'unicorn/no-unnecessary-slice-end': 'error',
	'unicorn/no-unreadable-iife': 'error',
	'unicorn/no-useless-promise-resolve-reject': 'error',
	'unicorn/no-useless-switch-case': 'error',
	'unicorn/no-useless-undefined': 'error',
	'unicorn/prefer-array-flat': 'warn',
	'unicorn/prefer-array-some': 'warn',
	'unicorn/prefer-at': 'warn',
	'unicorn/prefer-blob-reading-methods': 'error',
	'unicorn/prefer-code-point': 'warn',
	'unicorn/prefer-date-now': 'error',
	'unicorn/prefer-dom-node-dataset': 'warn',
	'unicorn/prefer-dom-node-remove': 'warn',
	'unicorn/prefer-event-target': 'error',
	'unicorn/prefer-import-meta-properties': 'error',
	'unicorn/prefer-math-min-max': 'warn',
	'unicorn/prefer-math-trunc': 'error',
	'unicorn/prefer-native-coercion-functions': 'error',
	'unicorn/prefer-number-coercion': 'error',
	'unicorn/prefer-prototype-methods': 'warn',
	'unicorn/prefer-query-selector': 'warn',
	'unicorn/prefer-regexp-test': 'error',
	'unicorn/prefer-single-call': 'error',
	'unicorn/prefer-string-replace-all': 'error',
	'unicorn/prefer-string-slice': 'warn',
	'unicorn/prefer-top-level-await': 'error',
	'unicorn/prefer-type-error': 'error',
	'unicorn/require-number-to-fixed-digits-argument': 'warn',

	//Perf
	'unicorn/prefer-array-find': 'warn',
	'unicorn/prefer-array-flat-map': 'warn',
	'unicorn/prefer-set-has': 'warn',

	//Restriction
	'unicorn/import-style': 'error',
	'unicorn/no-abusive-eslint-disable': 'error',
	'unicorn/no-array-for-each': 'error',
	'unicorn/no-array-reduce': ['error', { allowSimpleOperations: true }],
	'unicorn/no-document-cookie': 'error',
	'unicorn/no-length-as-slice-end': 'error',
	'unicorn/no-magic-array-flat-depth': 'error',
	'unicorn/no-process-exit': 'error',
	'unicorn/no-useless-error-capture-stack-trace': 'error',
	'unicorn/prefer-modern-math-apis': 'error',
	'unicorn/prefer-module': 'error',
	'unicorn/prefer-node-protocol': 'error',
	'unicorn/prefer-number-properties': 'error',

	// Style
	'unicorn/catch-error-name': ['error', { name: 'err' }],
	'unicorn/consistent-date-clone': 'error',
	'unicorn/consistent-existence-index-check': 'error',
	'unicorn/consistent-template-literal-escape': 'warn',
	'unicorn/custom-error-definition': 'error',
	'unicorn/empty-brace-spaces': 'error',
	'unicorn/error-message': 'error',
	'unicorn/explicit-timer-delay': 'error',
	'unicorn/filename-case': ['error', { case: 'camelCase' }],
	'unicorn/max-nested-calls': ['error', { max: MAX_NESTED_CALLS }],
	'unicorn/no-array-method-this-argument': 'warn',
	'unicorn/no-await-expression-member': 'error',
	'unicorn/no-console-spaces': 'error',
	'unicorn/no-null': 'error',
	'unicorn/no-unreadable-array-destructuring': 'error',
	'unicorn/no-useless-collection-argument': 'error',
	'unicorn/no-zero-fractions': 'error',
	'unicorn/number-literal-case': 'error',
	'unicorn/numeric-separators-style': 'error',
	'unicorn/prefer-array-index-of': 'error',
	'unicorn/prefer-bigint-literals': 'warn',
	'unicorn/prefer-class-fields': 'warn',
	'unicorn/prefer-classlist-toggle': 'error',
	'unicorn/prefer-default-parameters': 'error',
	'unicorn/prefer-dom-node-text-content': 'error',
	'unicorn/prefer-export-from': 'error',
	'unicorn/prefer-global-this': 'error',
	'unicorn/prefer-includes': 'warn',
	'unicorn/prefer-keyboard-event-key': 'error',
	'unicorn/prefer-logical-operator-over-ternary': 'error',
	'unicorn/prefer-modern-dom-apis': 'error',
	'unicorn/prefer-negative-index': 'error',
	'unicorn/prefer-object-from-entries': 'error',
	'unicorn/prefer-optional-catch-binding': 'warn',
	'unicorn/prefer-reflect-apply': 'warn',
	'unicorn/prefer-response-static-json': 'error',
	'unicorn/prefer-spread': 'error',
	'unicorn/prefer-string-raw': 'error',
	'unicorn/prefer-string-trim-start-end': 'error',
	'unicorn/prefer-structured-clone': 'error',
	'unicorn/prefer-ternary': 'warn',
	'unicorn/relative-url-style': ['error', 'always'],
	'unicorn/require-array-join-separator': 'warn',
	'unicorn/require-module-attributes': 'error',
	'unicorn/switch-case-braces': ['error', 'always'],
	'unicorn/switch-case-break-position': 'error',
	'unicorn/text-encoding-identifier-case': 'error',
	'unicorn/throw-new-error': 'error',

	// Suspicious
	'unicorn/consistent-function-scoping': 'error',
	'unicorn/no-accessor-recursion': 'error',
	'unicorn/no-array-fill-with-reference-type': 'error',
	'unicorn/no-array-reverse': 'warn',
	'unicorn/no-array-sort': 'error',
	'unicorn/no-confusing-array-with': 'error',
	'unicorn/no-instanceof-builtins': 'error',
	'unicorn/prefer-add-event-listener': 'error',
	'unicorn/require-module-specifiers': 'error',
	'unicorn/require-post-message-target-origin': 'error',
};

// Module boundaries (import)
const importRules: LintRules = {
	// Restriction
	'import/no-commonjs': 'error',
	'import/no-cycle': 'error',
	'import/no-default-export': 'error',

	// Style
	'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
	'import/first': 'error',
	'import/newline-after-import': 'error',
	'import/no-anonymous-default-export': 'error',
	'import/no-duplicates': 'error',
	'import/no-mutable-exports': 'error',

	// Suspicious
	'import/no-absolute-path': 'error',
	'import/no-empty-named-blocks': 'error',
	'import/no-named-as-default': 'error',
	'import/no-named-as-default-member': 'error',
	'import/no-self-import': 'error',
	'import/no-unassigned-import': ['error', { allow: ['**/*.css'] }],
};

// Promise handling (promise)
const promiseRules: LintRules = {
	// Restriction
	'promise/catch-or-return': 'error',

	// Style
	'promise/no-nesting': 'error',
	'promise/no-return-wrap': 'error',
	'promise/param-names': 'error',
	'promise/prefer-await-to-callbacks': 'error',
	'promise/prefer-await-to-then': 'error',

	// Suspicious
	'promise/no-multiple-resolved': 'error',
	'promise/no-promise-in-callback': 'error',

	// Correctness (already enabled by the category, listed for visibility)
	'promise/no-callback-in-promise': 'error',
	'promise/no-new-statics': 'error',
	'promise/valid-params': 'error',
};

// Alphabetical ordering (eslint-plugin-perfectionist, loaded through jsPlugins)
const perfectionistRules: LintRules = {
	// Imports and exports
	'perfectionist/sort-exports': 'error',
	'perfectionist/sort-imports': 'error',
	'perfectionist/sort-named-exports': 'error',
	'perfectionist/sort-named-imports': 'error',

	// Types
	'perfectionist/sort-enums': 'error',
	'perfectionist/sort-heritage-clauses': 'error',
	'perfectionist/sort-interfaces': 'error',
	'perfectionist/sort-intersection-types': 'error',
	'perfectionist/sort-object-types': 'error',
	'perfectionist/sort-union-types': 'error',

	// Objects and collections
	'perfectionist/sort-array-includes': 'error',
	'perfectionist/sort-maps': 'error',
	// Comments split objects into independently sorted groups
	'perfectionist/sort-objects': ['error', { partitionByComment: true }],
	'perfectionist/sort-sets': 'error',
	'perfectionist/sort-variable-declarations': 'error',

	// Classes and statements
	'perfectionist/sort-classes': 'error',
	'perfectionist/sort-switch-case': 'error',
};

export const baseRules: LintRules = {
	...eslintRules,
	...typescriptRules,
	...unicornRules,
	...importRules,
	...promiseRules,
	...perfectionistRules,
	'vite-plus/prefer-vite-plus-imports': 'error',
};

// Tooling files that must use default exports (vite.config.ts, etc.)
export const configFilesLint: LintOverride = {
	rules: { 'import/no-default-export': 'off' },
};
