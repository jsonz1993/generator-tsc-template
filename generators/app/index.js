'use strict';
const Generator = require('yeoman-generator');
const _ = require('lodash');
const chalk = require('chalk');
const yosay = require('yosay');

_.extend(Generator.prototype, require('yeoman-generator/lib/actions/install'));

const options = [
	{
		type: 'input',
		name: 'name',
		message: 'Your project name',
		default: this.appname,
	},
];

module.exports = class extends Generator {
	constructor(name, args) {
		super(name, args);

		options.forEach(item => {
			this.argument(item.name, {
				type: String,
				required: false,
				desc: item.message,
				default: item.default,
			});
		});
	}

	async prompting() {
		// Have Yeoman greet the user.
		this.log(
			yosay(
				`Welcome to the magnificent ${chalk.red(
					'generator-tsc-template',
				)} generator!`,
			),
		);

		this.answers = await this.prompt(options);
	}

	async writing() {
		const {name} = this.answers;
		this.destinationRoot(this.destinationPath(name));

		const devDependencies = await this.addDevDependencies([
			'@babel/cli',
			'@babel/core',
			'@babel/preset-env',
			'@babel/preset-typescript',
			'jest',
			'prettier',
			'eslint',
			'ts-node',
			'tsup',
			'typescript',
			'@commitlint/cli',
			'@commitlint/config-conventional',
			'cz-conventional-changelog',
			'lint-staged',
			'simple-git-hooks',
		]);

		this.packageJson.merge({
			name,
			version: '0.1.0',
			description: '',
			main: 'dist/index.js',
			scripts: {
				dev: 'npm run build -- --watch',
				build: 'tsup src/index.ts --format cjs,esm --dts',
				test: 'jest',
				commit: 'cz',
				format: 'prettier --write .',
			},
			keywords: [],
			license: 'ISC',
			'lint-staged': {
				'*': [
					'prettier --write --ignore-unknown',
				],
				'*.{js,ts}': ['eslint --cache'],
			},
			'simple-git-hooks': {
				'pre-commit': 'npx lint-staged',
				'commit-msg': 'npx --no -- commitlint --edit',
			},
			config: {
				commitizen: {
					path: 'cz-conventional-changelog',
				},
			},
			devDependencies,
		});

		this.fs.copy(this.templatePath(), this.destinationPath());
		this.fs.copy(this.templatePath('.*'), this.destinationPath());
	}

	install() {
		this.npmInstall();
	}

	end() {
		this.spawnCommandSync('git', ['init']);
		this.spawnCommandSync('npx', ['simple-git-hooks']);
	}
};
