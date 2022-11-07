const { execSync } = require('child_process')
const chalk = require('chalk')

function exec(sh, params = {}) {
  // eslint-disable-next-line no-console
  console.log(
    chalk.green(`exec: ${sh}`),
  )
  return execSync(sh, { encoding: 'utf-8', ...params })
}

module.exports = {
  exec,
}
