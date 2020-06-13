// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true
  },
  env: {
    node: true,
    es6: true
  },
  globals: {
    path: true,
    gulp: true,
    $: true,
    server: true,
    webpack: true,
    through2: true,
    PluginError: true,
    BalmJS: true
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint'
  ],
  rules: {
    'prettier/prettier': 'error',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-empty-function': [2, { allow: ['arrowFunctions'] }],
    '@typescript-eslint/camelcase': [
      2,
      { allow: ['child_process', 'drop_console', 'ascii_only'] }
    ]
  }
};
