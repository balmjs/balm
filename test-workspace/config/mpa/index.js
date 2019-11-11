const balm = require('../balm');
const balmConfig = require('../balmrc');

balm.config = Object.assign(balmConfig, {
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
    options: {
      compress: {
        drop_console: false
      }
    }
  }
});

balm.go();
