const balmrc = require('../balmrc');

module.exports = Object.assign(balmrc, {
  roots: {
    source: 'mpa'
  },
  scripts: {
    entry: {
      // lib: ['jquery', 'lodash', 'moment'],
      lib1: ['jquery'],
      lib2: ['lodash'],
      lib3: ['moment'],
      'page-a': './mpa/scripts/page-1.js',
      'page-b': './mpa/scripts/page-2.js',
      'page-c': './mpa/scripts/page-3.js'
    },
    minifyOptions: {
      compress: {
        drop_console: false
      }
    }
  }
});
