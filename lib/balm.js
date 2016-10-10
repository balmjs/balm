import './global';
import './log';
import {isString, mergeDeep} from './helper';
import {init, ready, run} from './bootstrap/initialization';

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
  go(recipe = BalmJS.noop) {
    if (this.running) {
      if (isString(recipe)) {
        run(recipe);
      } else {
        BalmJS.log('Invalid recipe', recipe, 'warning');
      }
    } else {
      this.running = true;

      init();

      recipe(BalmJS.mixins);

      ready();
    }
  }
}

export default Balm;
