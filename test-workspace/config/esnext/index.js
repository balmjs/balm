const path = require('path');
const balm = require('../balm');
const balmrc = require('../balmrc');

const balmConfig = Object.assign(balmrc, {
  roots: {
    source: 'esnext'
  },
  scripts: {
    entry: {
      // polyfill: './esnext/scripts/polyfill.js',
      main: './esnext/scripts/index.js'
    },
    alias: {
      '@': path.resolve(__dirname, '..', '..', 'esnext', 'scripts')
    }
  },
  ie8: true
});

balm.config = balmConfig;

balm.go();
