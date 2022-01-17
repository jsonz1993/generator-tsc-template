const { defineConfig } = require('eslint-define-config')

module.exports = defineConfig({
  env: {},
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2021
  },
  parser: '@typescript-eslint/parser',
  rules: {
    semi: ["error", "never"],
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/no-var-requires': 'off',
    'node/no-unpublished-require': 'off',
    'node/no-unsupported-features/es-syntax': 'off',
    'node/no-missing-import': [
      'error',
      {
        tryExtensions: ['.ts', '.js', '.jsx', '.tsx', '.d.ts']
      }
    ],
    'node/no-missing-require': [
      'error',
      {
        tryExtensions: ['.ts', '.js', '.jsx', '.tsx', '.d.ts']
      }
    ]
  }
})
