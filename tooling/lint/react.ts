// Strict lint rules for the React app (apps/web).

import type { LintOverride, LintRules } from './base.ts';

const MAX_COMPONENT_LINES = 80;
const MAX_COMPONENT_STATEMENTS = 15;
const MAX_JSX_DEPTH = 5;

const reactRules: LintRules = {
	// Pedantic
	'react/checked-requires-onchange-or-readonly': 'error',
	'react/jsx-no-target-blank': ['error', { enforceDynamicLinks: 'always' }],
	'react/jsx-no-useless-fragment': 'error',
	'react/no-unescaped-entities': 'error',
	'react/rules-of-hooks': 'error',

	// Perf
	'react/jsx-no-constructed-context-values': 'error',
	'react/no-array-index-key': 'error',
	'react/no-deriving-state-in-effects': 'error',
	'react/no-object-type-as-default-prop': 'error',

	// Restriction
	'react/button-has-type': 'error',
	'react/no-danger': 'error',
	'react/no-multi-comp': 'error',
	'react/no-unknown-property': 'error',
	'react/only-export-components': ['error', { allowConstantExport: true }],

	// Style
	'react/function-component-definition': [
		'error',
		{
			namedComponents: 'function-declaration',
			unnamedComponents: 'arrow-function',
		},
	],
	'react/hook-use-state': 'error',
	'react/jsx-boolean-value': ['error', 'never'],
	'react/jsx-curly-brace-presence': [
		'error',
		{ children: 'never', props: 'never' },
	],
	'react/jsx-fragments': ['error', 'syntax'],
	'react/jsx-handler-names': 'error',
	'react/jsx-max-depth': ['error', { max: MAX_JSX_DEPTH }],
	'react/jsx-pascal-case': 'error',
	'react/jsx-props-no-spreading': 'error',
	'react/self-closing-comp': 'error',

	// Suspicious
	'react/iframe-missing-sandbox': 'error',
	'react/jsx-no-comment-textnodes': 'error',
	'react/jsx-no-script-url': 'error',
	'react/no-namespace': 'error',
	'react/no-unstable-nested-components': 'error',
	'react/react-in-jsx-scope': 'off',
	'react/style-prop-object': 'error',

	// Correctness (already enabled by the category, listed for visibility)
	'react/exhaustive-deps': 'error',
	'react/immutability': 'error',
	'react/jsx-key': [
		'error',
		{ checkFragmentShorthand: true, checkKeyMustBeforeSpread: true },
	],
	'react/jsx-no-duplicate-props': 'error',
	'react/jsx-props-no-spread-multi': 'error',
	'react/no-children-prop': 'error',
	'react/no-danger-with-children': 'error',
	'react/no-direct-mutation-state': 'error',
	'react/no-this-in-sfc': 'error',
	'react/purity': 'error',
	'react/set-state-in-effect': 'error',
	'react/set-state-in-render': 'error',
	'react/static-components': 'error',
	'react/void-dom-elements-no-children': 'error',
};

const reactPerfRules: LintRules = {
	// Perf
	'react-perf/jsx-no-jsx-as-prop': 'error',
	'react-perf/jsx-no-new-array-as-prop': 'error',
	// Conflicts with jsx-handler-names: local handleX functions would all need useCallback
	'react-perf/jsx-no-new-function-as-prop': 'off',
	'react-perf/jsx-no-new-object-as-prop': 'error',
};

const a11yRules: LintRules = {
	// Restriction
	'jsx-a11y/anchor-ambiguous-text': 'error',

	// Correctness (already enabled by the category, listed for visibility)
	'jsx-a11y/alt-text': 'error',
	'jsx-a11y/anchor-has-content': 'error',
	'jsx-a11y/anchor-is-valid': 'error',
	'jsx-a11y/aria-activedescendant-has-tabindex': 'error',
	'jsx-a11y/aria-props': 'error',
	'jsx-a11y/aria-proptypes': 'error',
	'jsx-a11y/aria-role': 'error',
	'jsx-a11y/aria-unsupported-elements': 'error',
	'jsx-a11y/autocomplete-valid': 'error',
	'jsx-a11y/click-events-have-key-events': 'error',
	'jsx-a11y/control-has-associated-label': 'error',
	'jsx-a11y/heading-has-content': 'error',
	'jsx-a11y/html-has-lang': 'error',
	'jsx-a11y/iframe-has-title': 'error',
	'jsx-a11y/img-redundant-alt': 'error',
	'jsx-a11y/interactive-supports-focus': 'error',
	'jsx-a11y/label-has-associated-control': 'error',
	'jsx-a11y/lang': 'error',
	'jsx-a11y/media-has-caption': 'error',
	'jsx-a11y/mouse-events-have-key-events': 'error',
	'jsx-a11y/no-access-key': 'error',
	'jsx-a11y/no-aria-hidden-on-focusable': 'error',
	'jsx-a11y/no-autofocus': 'error',
	'jsx-a11y/no-distracting-elements': 'error',
	'jsx-a11y/no-interactive-element-to-noninteractive-role': 'error',
	'jsx-a11y/no-noninteractive-element-interactions': 'error',
	'jsx-a11y/no-noninteractive-element-to-interactive-role': 'error',
	'jsx-a11y/no-noninteractive-tabindex': 'error',
	'jsx-a11y/no-redundant-roles': 'error',
	'jsx-a11y/no-static-element-interactions': 'error',
	'jsx-a11y/prefer-tag-over-role': 'error',
	'jsx-a11y/role-has-required-aria-props': 'error',
	'jsx-a11y/role-supports-aria-props': 'error',
	'jsx-a11y/scope': 'error',
	'jsx-a11y/tabindex-no-positive': 'error',
};

// Base rules that do not fit React code
const baseOverrides: LintRules = {
	// JSX with one attribute per line (oxfmt) is verbose; complexity keeps the base limit
	'max-lines-per-function': [
		'error',
		{ max: MAX_COMPONENT_LINES, skipBlankLines: true, skipComments: true },
	],
	// Each hook and handler declaration counts as a statement
	'max-statements': ['error', { max: MAX_COMPONENT_STATEMENTS }],

	// `onClick={() => setOpen(false)}` is idiomatic React
	'typescript/no-confusing-void-expression': [
		'error',
		{ ignoreArrowShorthand: true },
	],
	// Props holding ReactNode or callbacks can never be deeply readonly
	'typescript/prefer-readonly-parameter-types': 'off',
	// Components are PascalCase, hooks camelCase, everything else kebab-case
	'unicorn/filename-case': [
		'error',
		{ cases: { camelCase: true, kebabCase: true, pascalCase: true } },
	],
	// Components return null to render nothing
	'unicorn/no-null': 'off',
};

export const reactLint: LintOverride = {
	env: { browser: true },
	plugins: ['react', 'react-perf', 'jsx-a11y'],
	rules: {
		...reactRules,
		...reactPerfRules,
		...a11yRules,
		...baseOverrides,
		'perfectionist/sort-jsx-props': 'error',
	},
};
