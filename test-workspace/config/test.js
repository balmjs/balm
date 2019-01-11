import balmConfig from './balmrc';
import jsConfig from './spa/main-sync';

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

export default balmConfig;
