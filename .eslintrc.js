// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  env: {
    node: true,
    es6: true,
    mocha: true
  },
  globals: {
    path: true,
    gulp: true,
    $: true,
    browserSync: true,
    del: true,
    cssnano: true,
    webpack: true,
    BalmJS: true,
    config: true,
    logger: true,
    getNamespace: true,
    File: true,
    Task: true
  },
  plugins: ['prettier'],
  extends: ['xo', 'prettier'],
  rules: {
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    camelcase: [2, { properties: 'never' }],
    'prettier/prettier': [
      'error',
      {
        singleQuote: true
      }
    ]
  }
};
