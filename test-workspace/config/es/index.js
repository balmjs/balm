const balmrc = require('../balmrc');

module.exports = Object.assign(balmrc, {
  roots: {
    source: 'es'
  },
  scripts: {
    entry: {
      // polyfill: './es/scripts/polyfill.js',
      main: './es/scripts/index.js'
    },
    babelLoaderOptions: {
      presets: [
        [
          '@babel/env',
          {
            // loose: true,
            modules: 'commonjs',
            // debug: true,
            useBuiltIns: 'entry',
            corejs: 3
          }
        ]
      ],
      plugins: [
        ['@babel/transform-runtime', { corejs: 3 }]
        // "@babel/plugin-syntax-dynamic-import"
      ]
    },
    ie8: true
  }
});
