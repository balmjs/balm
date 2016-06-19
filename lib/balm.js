import './global';
import { mergeDeep, init } from './helper';

class Balm {
  constructor() {
    this.running = false;
  }
  get config() {
    return configs;
  }
  set config(data) {
    let defaults = config;
    // step 1: overwrite config
    config = mergeDeep(defaults, data);
    // step 2: cp config.paths.source config.paths.tmp
    config = mergeDeep(config, {
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

      recipe(mix);
    } else {
      console.warn('BalmJS is running...');
    }
  }
}

export default Balm;
