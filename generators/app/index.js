'use strict'
const fs = require('fs')
const Generator = require('yeoman-generator')
const _ = require('lodash')
const chalk = require('chalk')
const yosay = require('yosay')
const deps = require('./dependencies')
const pkg = require('./package.json')

_.extend(Generator.prototype, require('yeoman-generator/lib/actions/install'))

const options = [
  {
    type: 'input',
    name: 'name',
    message: 'Your project name',
    default: this.appname
  }
]

module.exports = class extends Generator {
  constructor(name, args) {
    super(name, args)

    options.forEach(item => {
      this.argument(item.name, {
        type: String,
        required: false,
        desc: item.message,
        default: item.default
      })
    })
  }

  async prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the magnificent ${chalk.red(
          'generator-tsc-template'
        )} generator!`
      )
    )

    // 如果传了name,直接跳过询问阶段
    const answersOptions = options.filter(item => !this.options[item.name])
    this.answers = await this.prompt(answersOptions) || {}

    this.props = _.merge({}, this.answers, this.options)
  }

  async conflicts() {
    await this.addDevDependencies(deps.devDeps)
  }

  async writing() {
    const { name } = this.props
    this.destinationRoot(this.destinationPath(name))

    // 想默认最新版本，所以不写在packageJson
    this.packageJson.merge({
      name,
      ...pkg
    })

    this.fs.copy(this.templatePath(), this.destinationPath())
    this.fs.copy(this.templatePath('.*'), this.destinationPath())
    this.fs.move(
      this.destinationPath('_gitignore'),
      this.destinationPath('.gitignore')
    )

    fs.appendFileSync(this.destinationPath('README.md'), `# ${name}`)
  }

  install() {
    this.spawnCommandSync('npm', ['install'])
  }

  _initGitHooks() {
    this.log(chalk.blue('init simple-git-hooks'))
    this.spawnCommandSync('git', ['config', 'core.hooksPath', '.git/hooks/'])
    this.spawnCommandSync('rm', ['-rf', '.git/hooks'])
    this.spawnCommandSync('npx', ['simple-git-hooks'])
  }

  end() {
    this.log(chalk.blue('init git'))
    this.spawnCommandSync('git', ['init'])

    this._initGitHooks()

    this.log(chalk.green('enjoy work!'))
  }
}
