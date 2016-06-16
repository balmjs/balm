import { mergeDeep, init } from './helper';

class Balm {
  constructor() {
    this.configs = config;
    this.running = false;
  }
  get config() {
    return this.configs;
  }
  set config(data) {
    // step 1: overwrite config
    config = mergeDeep(this.configs, data);
    // step 2: cp config.paths.source config.paths.tmp
    let defaults = config;
    config = mergeDeep(defaults, {
      paths: {
        tmp: defaults.paths.source
      }
    });
    // step 3: overwrite config.paths.tmp
    if (typeof data.paths !== 'undefined' && typeof data.paths.tmp !== 'undefined') {
      config = mergeDeep(config, {
        paths: {
          tmp: data.paths.tmp
        }
      });
    }
  }
  go(recipe = noop) {
    if (!this.running) {
      this.running = true;

      init();

      recipe(); // TODO: to extend
    } else {
      console.warn('BalmJS is running...');
    }
  }
}

export default Balm;
