import jsConfig from './spa/main-sync';

let balmConfig = require('./balmrc');

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
  isProd: true,
  scripts,
  cache: true
});

export default balmConfig;
