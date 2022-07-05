/* eslint-disable no-console */
const path = require('path')
const fs = require('fs')
const { ESLint } = require('eslint')

const removeIgnoredFiles = async (files) => {
  try {
    const eslint = new ESLint()
    const isIgnored = await Promise.all(
      files.map((file) => {
        return eslint.isPathIgnored(file)
      }),
    )
    const filteredFiles = files.filter((_, i) => !isIgnored[i])
    return filteredFiles.join(' ')
  } catch (e) {
    console.error('lint-stage eslint error')
    console.error(e.toString())
    process.exit(1)
  }
}

const generateTSConfig = (stagedFilenames) => {
  try {
    const configPath = path.join(__dirname, './tsconfig.json')
    const tsconfig = JSON.parse(fs.readFileSync(configPath, 'utf8'))
    tsconfig.include = stagedFilenames
    fs.writeFileSync(
      path.join(__dirname, './tsconfig.lint.json'),
      JSON.stringify(tsconfig),
    )
    return 'tsc --noEmit --project tsconfig.lint.json'
  } catch (e) {
    console.error('lint-stage tsc error')
    console.error(e.toString())
    process.exit(1)
  }
}

module.exports = {
  '!*.(js,ts,tsx,jsx)': ['prettier --write --ignore-unknown'],
  '*.ts': [generateTSConfig],
  '*.{js,ts}': [
    async (files) => {
      const filesToLint = await removeIgnoredFiles(files)
      return `eslint --cache ${filesToLint}`
    },
  ],
}
