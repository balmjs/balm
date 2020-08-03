const balmrc = require('../balmrc');

module.exports = Object.assign(balmrc, {
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
