// You need add "@babel/plugin-syntax-dynamic-import" in `.babelrc`
module.exports = {
  entry: {
    main: './spa/scripts/main-async.js'
  },
  babelLoaderOptions: {
    presets: [['@babel/env', { modules: false }]],
    plugins: [
      ['@babel/transform-runtime', { corejs: 3 }],
      '@babel/plugin-syntax-dynamic-import'
    ]
  }
};
