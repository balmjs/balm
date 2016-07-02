import './global';
import { mergeDeep, init } from './helper';

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
    // step 3: for the dynamic project
    if (config.proxy) {
      config.roots.tmp = config.roots.target;
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
