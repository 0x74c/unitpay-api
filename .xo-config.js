module.exports = {
	prettier: true,
	plugins: [
		'jest',
	],
	extends: [
		'plugin:jest/recommended',
	],
	rules: {
		'unicorn/no-array-callback-reference': 'off',
		'@typescript-eslint/object-curly-spacing': [
			'error',
			'always',
		],
		'@typescript-eslint/restrict-template-expressions': 'off',
		'jest/expect-expect': [
			'error',
			{
				assertFunctionNames: [
					'expect',
					'verify',
					'dbTest'
				],
			},
		],
		semi: 'off',
		'@typescript-eslint/semi': 'off',
		'@typescript-eslint/member-delimiter-style': [
			'error',
			{
				multiline: {
					delimiter: 'none'
				},
				singleline: {
					delimiter: 'comma',
					requireLast: false
				}
			}
		],
		'func-style': [
			'error',
			'declaration',
			{
				allowArrowFunctions: true
			}
		],
		'@typescript-eslint/ban-types': [
			'error',
			{
				types: {
					null: false
				}
			}
		]
	},
	overrides: [{
		"files": '**/*.test.ts',
		"rules": {
			'max-nested-callbacks': 'off',
		},
	}]
}