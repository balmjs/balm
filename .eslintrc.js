// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  env: {
    node: true,
    es6: true,
    mocha: true
  },
  globals: {
    path: true,
    task: true,
    series: true,
    parallel: true,
    src: true,
    dest: true,
    $: true,
    server: true,
    del: true,
    cssnano: true,
    webpack: true,
    BalmJS: true,
    config: true,
    logger: true,
    toNamespace: true,
    BalmFile: true,
    BalmTask: true
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],
  rules: {
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
};
