import balm from '../../../dist'; // from local
// import balm from 'balm'; // from node_modules

let balmConfig = require('../balmrc');

balmConfig.scripts = {
  entry: {
    // lib: ['jquery', 'lodash', 'moment'],
    lib1: ['jquery'],
    lib2: ['lodash'],
    lib3: ['moment'],
    'page-a': './src/scripts/mpa/page-a.js',
    'page-b': './src/scripts/mpa/page-b.js',
    'page-c': './src/scripts/mpa/page-c.js'
  },
  // extractAllVendors: true,
  options: {
    compress: {
      drop_console: false
    }
  }
};

balm.config = balmConfig;

balm.go();
