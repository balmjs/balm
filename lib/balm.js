import './global';
import { isArray, isFunction, mergeDeep } from './utilities';
import { init, checkGulpTask } from './bootstrap';
import { webpackConfig } from './bundler/webpack.config';

class Balm {
  constructor() {
    this.running = false;
  }

  get config() {
    return config; // Global
  }

  set config(data) {
    let defaults = config;
    // 0. Previously on config
    if (data.scripts && data.scripts.entry && !data.scripts.vendors) {
      for (let key of Object.keys(data.scripts.entry)) {
        let value = data.scripts.entry[key];
        if (isArray(value)) {
          defaults.scripts.vendors.push({
            key,
            value
          });
        }
      }
    }
    // 1. Overwrite config
    config = mergeDeep(defaults, data);
    // 2. Copy `config.paths.target` to `config.paths.tmp`
    config = mergeDeep(config, {
      paths: {
        tmp: config.paths.target
      }
    });
    config.paths.tmp.font = config.paths.source.font; // Fix for dev
    // 3. For the dynamic project
    if (!config.static) {
      config.roots.tmp = config.roots.target;
    }
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
