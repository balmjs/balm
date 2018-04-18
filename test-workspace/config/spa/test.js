var balmConfig = require('../balmrc');
var jsConfig = require('./main-sync');

var scripts = Object.assign(jsConfig, {
  eslint: true,
  options: {
    compress: {
      drop_console: false
    }
  }
});

balmConfig.assets.subDir = 'web';
balmConfig = Object.assign(balmConfig, {
  production: true,
  scripts,
  cache: true
});

module.exports = balmConfig;
