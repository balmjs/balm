const balmrc = require('../balmrc');

module.exports = Object.assign(balmrc, {
  roots: {
    source: 'es'
  },
  scripts: {
    entry: {
      // polyfill: './esnext/scripts/polyfill.js',
      main: './es/scripts/index.js'
    },
    ie8: true
  }
});
