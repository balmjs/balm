let balmConfig = require('./balmrc');
const jsConfig = require('./spa/main-sync');

const scripts = Object.assign(jsConfig, {
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
