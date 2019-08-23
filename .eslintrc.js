// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2019,
    sourceType: 'module'
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
  plugins: ['prettier'],
  extends: ['xo', 'plugin:prettier/recommended'],
  rules: {
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    camelcase: [2, { allow: ['child_process', 'drop_console', 'ascii_only'] }]
  }
};
