const fs = require('fs')
const { ESLint } = require('eslint')

const removeIgnoredFiles = async (files) => {
  const eslint = new ESLint()
  const isIgnored = await Promise.all(
    files.map((file) => {
      return eslint.isPathIgnored(file)
    }),
  )
  const filteredFiles = files.filter((_, i) => !isIgnored[i])
  return filteredFiles.join(' ')
}

const generateTSConfig = stagedFilenames => {
  const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'))
  tsconfig.include = stagedFilenames
  fs.writeFileSync('tsconfig.lint.json', JSON.stringify(tsconfig))
  return 'tsc --noEmit --project tsconfig.lint.json'
}

module.exports = {
  '*': [
    'prettier --write --ignore-unknown',
  ],
  '*.ts': [
    generateTSConfig,
  ],
  '*.{js,ts}': [
    async (files) => {
      const filesToLint = await removeIgnoredFiles(files)
      return `eslint --cache ${filesToLint}`
    },
  ],
}
