import './global';
import { isArray, isFunction, mergeDeep } from './helpers/index';
import init from './bootstrap/initialization';

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
          defaults.scripts.vendors.push(key);
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

  set beforeTask(fn = BalmJS.noop) {
    BalmJS.beforeTask = fn;
  }

  set afterTask(fn = BalmJS.noop) {
    BalmJS.afterTask = fn;
  }

  register() {
    // TODO
  }

  go(recipe = BalmJS.noop) {
    if (this.running) {
      logger.warning('[Init]', 'BalmJS is running', true);
    } else if (isFunction(recipe)) {
      this.running = true;

      init();

      recipe(BalmJS.mixins);
    } else {
      logger.error('[Init]', 'BalmJS API: `balm.go(mix => {})`', true);
    }
  }

  reset() {
    this.running = false;
    config.useDefault = false;
    BalmJS.afterTask = () => {};
  }
}

export default Balm;
