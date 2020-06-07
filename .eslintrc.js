// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname
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
    'prettier',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],
  rules: {
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-empty-function': [2, { allow: ['arrowFunctions'] }],
    '@typescript-eslint/camelcase': [
      2,
      { allow: ['child_process', 'drop_console', 'ascii_only'] }
    ]
  }
};
