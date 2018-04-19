import './global';
import { isFunction } from './utilities';
import { setConfig, ready, init, checkGulpTask } from './bootstrap';
import { webpackConfig } from './bundler/webpack.config';

class Balm {
  constructor() {
    this.running = false;

    setConfig();
    ready();
  }

  get config() {
    return config; // Global
  }

  set config(data) {
    setConfig(data);
  }

  set beforeTask(name) {
    let task = checkGulpTask(name);
    if (task) {
      BalmJS.beforeTask = task;
    }
  }

  set afterTask(name) {
    let task = checkGulpTask(name);
    if (task) {
      BalmJS.afterTask = task;
    }
  }

  go(recipe = BalmJS.noop) {
    if (this.running) {
      logger.warn('[Init]', 'BalmJS is running');
    } else if (isFunction(recipe)) {
      this.running = true;

      init();

      recipe(BalmJS.mixins);
    } else {
      logger.error('[Init]', 'BalmJS API: `balm.go(function(mix) {});`');
    }
  }

  reset() {
    this.running = false;

    config.useDefault = false;
    BalmJS.beforeTask = BalmJS.noop;
    BalmJS.afterTask = BalmJS.noop;
  }

  // For SSR in `setup-dev-server.js`
  getWebpackConfig(options = {}) {
    return webpackConfig('', '', options);
  }
}

export default Balm;
