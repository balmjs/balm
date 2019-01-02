import './global';
import { isFunction } from './utilities';
import { setConfig, init, checkGulpTask } from './bootstrap';

class Balm {
  constructor() {
    if (!Balm.instance) {
      Balm.instance = this;
    }

    return Balm.instance;
  }

  get config() {
    return config; // Global
  }

  set config(data) {
    setConfig(data);
  }

  set beforeTask(name) {
    let _task = checkGulpTask(name);
    if (_task) {
      BalmJS.beforeTask = _task;
    }
  }

  set afterTask(name) {
    let _task = checkGulpTask(name);
    if (_task) {
      BalmJS.afterTask = _task;
    }
  }

  go(recipe = BalmJS.noop) {
    if (isFunction(recipe)) {
      init();

      recipe(BalmJS.mixins);
    } else {
      logger.error('[Init]', 'BalmJS API: `balm.go(function(mix) {});`');
    }
  }

  reset() {
    config.useDefault = false;
    BalmJS.beforeTask = BalmJS.noop;
    BalmJS.afterTask = BalmJS.noop;
  }
}

export default Balm;
