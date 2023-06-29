module.exports = {
  env: {
    es2021: true,
    node: true,
    'jest/globals': true
  },
  extends: 'standard-with-typescript',
  plugins: ['jest'],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: [
      './packages/lang/tsconfig.json',
      './packages/cli/tsconfig.json',
      './packages/repl/tsconfig.json'
    ],
    tsconfigRootDir: __dirname
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
    '@typescript-eslint/dot-notation': 'off'

    // '@typescript-eslint/return-await': 'off',
    // '@typescript-eslint/consistent-type-assertions': 'off',
    // '@typescript-eslint/method-signature-style': 'off'
  }
}
