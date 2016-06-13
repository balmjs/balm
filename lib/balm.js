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
    config = mergeDeep(this.configs, data);
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
