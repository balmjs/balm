var balm = require('../../../lib/main'); // from local
// var balm = require('balm'); // from node_modules

var balmConfig = require('../balmrc');

balmConfig.scripts = {
  // extractAllVendors: true,
  entry: {
    lib: ['jquery', 'lodash', 'moment'],
    // lib1: ['jquery'],
    // lib2: ['lodash'],
    // lib3: ['moment'],
    'page-a': './src/scripts/page-a.js',
    'page-b': './src/scripts/page-b.js',
    'page-c': './src/scripts/page-c.js'
  },
  options: {
    compress: {
      drop_console: false
    }
  }
};

balm.config = balmConfig;

balm.go();
