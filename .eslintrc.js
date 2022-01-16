module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2021: true,
	},
	extends: [
		'xo',
	],
	parserOptions: {
		ecmaVersion: 'latest',
	},
	rules: {
		'capitalized-comments': 'off',
	},
};
