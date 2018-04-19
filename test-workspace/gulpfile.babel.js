var balm = require('../lib/main');

balm.config = {
  debug: true,
  server: {
    open: false
  },
  scripts: {
    entry: {
      main: './src/scripts/main-sync.js'
    }
  }
};

balm.go();

// require('./config/spa');
// require('./config/ssr/client');
