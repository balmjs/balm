import './global';
import {isString, mergeDeep} from './helper';
import {init, ready, run} from './bootstrap/initialization';

class Balm {
  constructor() {
    this.running = false;
  }
  get config() {
    return config; // Global
  }
  set config(data) {
    let defaults = config;
    // 1. Overwrite config
    config = mergeDeep(defaults, data);
    // 2. Copy `config.paths.source` to `config.paths.tmp`
    config = mergeDeep(config, {
      paths: {
        tmp: config.paths.source
      }
    });
    // 3. For the dynamic project
    if (!config.static) {
      config.roots.tmp = config.roots.target; // TODO: = source?
    }
  }
  go(recipe = BalmJS.noop) {
    if (this.running) {
      if (isString(recipe)) {
        run(recipe);
      } else {
        logger.warning('Invalid recipe', recipe);
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
