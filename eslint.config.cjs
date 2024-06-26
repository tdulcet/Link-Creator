// export NODE_PATH=$(npm root -g)

const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
	js.configs.recommended,
	{
		languageOptions: {
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module",
				ecmaFeatures: { impliedStrict: true }
			},
			globals: {
				...globals.browser,
				...globals.es2024,
				...globals.webextensions
			}
		},
		rules: {
			indent: ["error", "tab", { SwitchCase: 1 }],
			// "linebreak-style": ["error", "unix"],
			quotes: ["warn", "double", { avoidEscape: true }],
			semi: ["error", "always"],

			"array-callback-return": "error",
			"no-await-in-loop": "error",
			"no-promise-executor-return": "error",
			"no-self-compare": "error",
			"no-template-curly-in-string": "error",
			"no-unmodified-loop-condition": "error",
			"no-unreachable-loop": "error",
			"no-use-before-define": "error",
			"no-useless-assignment": "error",

			"consistent-return": "error",
			curly: "error",
			"default-param-last": "warn",
			"dot-notation": "error",
			eqeqeq: ["error", "smart"],
			"func-names": "warn",
			// "init-declarations": "warn",
			"logical-assignment-operators": [
				"warn",
				"always",
				{ enforceForIfStatements: true }
			],
			"no-array-constructor": "error",
			"no-caller": "warn",
			// "no-confusing-arrow": "warn",
			"no-continue": "warn",
			"no-else-return": "warn",
			"no-eval": "error",
			"no-extend-native": "warn",
			"no-extra-bind": "warn",
			"no-extra-label": "warn",
			"no-floating-decimal": "warn",
			"no-implicit-coercion": "warn",
			"no-implied-eval": "error",
			"no-invalid-this": "warn",
			"no-lonely-if": "warn",
			"no-loop-func": "error",
			"no-negated-condition": "warn",
			"no-new": "warn",
			"no-new-func": "error",
			"no-object-constructor": "error",
			"no-new-wrappers": "error",
			"no-octal-escape": "warn",
			"no-return-assign": "warn",
			"no-return-await": "warn",
			"no-undef-init": "warn",
			"no-undefined": "warn",
			"no-unneeded-ternary": "warn",
			"no-unused-expressions": "error",
			"no-useless-call": "warn",
			"no-useless-computed-key": "warn",
			"no-useless-concat": "warn",
			"no-useless-rename": "warn",
			"no-useless-return": "warn",
			"no-var": "warn",
			"object-shorthand": "warn",
			"operator-assignment": "warn",
			"prefer-arrow-callback": "warn",
			"prefer-const": ["error", { destructuring: "all" }],
			"prefer-destructuring": "warn",
			"prefer-exponentiation-operator": "warn",
			// "prefer-named-capture-group": "warn",
			"prefer-numeric-literals": "warn",
			"prefer-object-has-own": "warn",
			"prefer-object-spread": "warn",
			"prefer-regex-literals": "warn",
			"prefer-rest-params": "error",
			"prefer-spread": "error",
			"prefer-template": "warn",
			"quote-props": ["error", "as-needed"],
			"require-await": "warn",
			"require-unicode-regexp": "warn",
			"spaced-comment": "warn",
			// "strict": "warn",
			"symbol-description": "error",
			yoda: "error",

			"arrow-parens": "warn",
			"arrow-spacing": "warn",
			"block-spacing": "warn",
			"brace-style": "error",
			"comma-dangle": "warn",
			"comma-spacing": "warn",
			"comma-style": "warn",
			"computed-property-spacing": "warn",
			"func-call-spacing": "warn",
			"key-spacing": "warn",
			"keyword-spacing": "warn",
			"no-extra-parens": "warn",
			"no-multi-spaces": "warn",
			"no-trailing-spaces": "warn",
			"no-whitespace-before-property": "warn",
			"rest-spread-spacing": "warn",
			"semi-spacing": "warn",
			"semi-style": "error",
			"space-before-blocks": "warn",
			// "space-before-function-paren": ["warn", "never"],
			"space-in-parens": "warn",
			"space-infix-ops": "warn",
			"space-unary-ops": "warn",
			"switch-colon-spacing": "warn",
			"template-curly-spacing": "warn"

			// "require-jsdoc": "error"
			// "require-jsdoc": "error"
		}
	},
	{ ignores: ["common/modules/*/*", "!common/modules/data/*", "browser-polyfill.js"] }
];
