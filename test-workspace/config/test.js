import jsConfig from './spa/main-sync';
import balmrc from './balmrc';

let balmConfig = balmrc.balmConfig;

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
  roots: {
    source: 'spa'
  },
  scripts,
  cache: true
});

export default balmConfig;
