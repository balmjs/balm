import './global';
import './log';
import {
  mergeDeep
} from './helper';
import {
  init,
  ready
} from './bootstrap/initialization';

class Balm {
  constructor() {
    this.running = false;
  }
  get config() {
    return config; // global
  }
  set config(data) {
    let defaults = config;
    // 1. overwrite config
    config = mergeDeep(defaults, data);
    // 2. cp config.paths.target config.paths.tmp
    config = mergeDeep(config, {
      paths: {
        tmp: config.paths.target
      }
    });
    config.paths.tmp.font = config.paths.source.font; // fix for dev
    // 3. for the dynamic project
    if (!config.static) {
      config.roots.tmp = config.roots.target;
    }
  }
  go(recipe) {
    if (this.running) {
      $.util.log($.util.colors.yellow('BalmJS is running...'));

      ready(recipe);
    } else {
      this.running = true;

      init();

      recipe(BalmJS.mixins);

      if (config.useDefault) {
        ready();
      }
    }
  }
}

export default Balm;
