const balmrc = require('../balmrc');

const balm = balmrc.balm;
let balmConfig = balmrc.balmConfig;

const scripts = {
  entry: {
    // lib: ['jquery', 'lodash', 'moment'],
    lib1: ['jquery'],
    lib2: ['lodash'],
    lib3: ['moment'],
    'page-a': './mpa/scripts/page-1.js',
    'page-b': './mpa/scripts/page-2.js',
    'page-c': './mpa/scripts/page-3.js'
  },
  // extractAllVendors: true,
  options: {
    compress: {
      drop_console: false
    }
  }
};

balmConfig = Object.assign(balmConfig, {
  roots: {
    source: 'mpa'
  },
  scripts,
  cache: true
});

balm.config = balmConfig;

balm.go();
