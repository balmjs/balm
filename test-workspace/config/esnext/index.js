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
    ie8: true
  }
});

balm.config = balmConfig;

balm.go();
