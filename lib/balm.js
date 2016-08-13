import './global';
import {
  mergeDeep,
  init
} from './helper';

class Balm {
  constructor() {
    this.running = false;
  }
  get config() {
    return config; // global
  }
  set config(data) {
    let defaults = config;
    // step 1: overwrite config
    config = mergeDeep(defaults, data);
    // step 2: cp config.paths.target config.paths.tmp
    config = mergeDeep(config, {
      paths: {
        tmp: config.paths.target
      }
    });
    config.paths.tmp.font = config.paths.source.font; // fix for dev
    // step 3: for the dynamic/static project
    if (!config.static) {
      config.roots.tmp = config.roots.target;
    }
  }
  go(recipe = noop) {
    if (this.running) {
      $.util.log($.util.colors.yellow('BalmJS is running...'));
    } else {
      this.running = true;

      init();

      recipe(mix);
    }
  }
}

export default Balm;
