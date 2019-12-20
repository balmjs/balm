const path = require('path');
const balm = require('../balm');
const balmrc = require('../balmrc');

const balmConfig = Object.assign(balmrc, {
  roots: {
    source: 'esnext'
  },
  scripts: {
    entry: {
      main: './esnext/scripts/index.js'
    },
    alias: {
      '@': path.resolve(__dirname, '..', '..', 'esnext', 'scripts')
    },
    options: {
      parse: {
        ecma: 8
      },
      compress: {
        ecma: 5,
        warnings: false,
        comparisons: false,
        inline: 2
      },
      mangle: {
        safari10: true
      },
      output: {
        ecma: 5,
        comments: false,
        ascii_only: true
      },
      ie8: true
    }
  }
});

balm.config = balmConfig;

balm.go();
