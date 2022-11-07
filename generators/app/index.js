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
  }, {
    type: 'confirm',
    name: 'git',
    message: 'Should init git?',
    default: true
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
    const answersOptions = options.filter(item => {
      switch (item.name) {
        case 'name':
          return !this.options.name
        case 'git':
          return typeof this.options.git !== 'string'
      }
      return true
    })
    this.answers = await this.prompt(answersOptions) || {}

    this.props = _.merge({}, this.options, this.answers)
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
  }

  install() {
    this.spawnCommandSync('npm', ['install'])
  }

  _initGitHooks() {
    // this.log(chalk.blue('init simple-git-hooks'))
    this.spawnCommandSync('git', ['config', 'core.hooksPath', '.git/hooks/'])
    this.spawnCommandSync('rm', ['-rf', '.git/hooks'])
    // this.spawnCommandSync('npx', ['simple-git-hooks'])
    this.log(
      `${chalk.yellow('run: ')} ${chalk.green('npx simple-git-hooks')}`
    )
  }

  end() {
    const { name, git } = this.props
    // git=== 'false' || 'true' || true || false
    fs.appendFileSync(this.destinationPath('README.md'), `# ${name}`)
    const shouldInitGIt = git === 'true' || git === true
    if (shouldInitGIt) {
      this.log(chalk.blue('init git'))
      this.spawnCommandSync('git', ['init'])
      this.spawnCommandSync('git', ['branch', '-m', 'master'])
      this._initGitHooks()
    } else {
      this.log(chalk.cyan(`
cd ${name}
git init && git config core.hooksPath .git/hooks/ && npx simple-git-hooks
`))
    }

    this.log(chalk.green('enjoy work!'))
  }
}
