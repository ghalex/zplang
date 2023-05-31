module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: 'standard-with-typescript',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: [
      'tsconfig.json'
    ],
    tsconfigRootDir: __dirname
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    // '@typescript-eslint/return-await': 'off',
    // '@typescript-eslint/consistent-type-assertions': 'off',
    // '@typescript-eslint/method-signature-style': 'off'
  }
}
