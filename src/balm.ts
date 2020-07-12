import pkg from '../package.json';
import './config';
import './utilities';
import './plugins';
import registerTasks from './tasks';
import { setConfig, setTask } from './bootstrap';
import { DeepPartial, BalmConfig } from '@balm/index';

class Balm {
  #config: BalmConfig;

  constructor() {
    console.log(`BalmJS version: ${pkg.version}`);
    this.#config = BalmJS.config;
  }

  get config(): DeepPartial<BalmConfig> {
    return this.#config;
  }
  set config(value: DeepPartial<BalmConfig>) {
    this.#config = setConfig(value);
    BalmJS.config = this.#config;
  }

  set beforeTask(name: string | Function) {
    BalmJS.beforeTask = setTask(name);
  }
  set afterTask(name: string | Function) {
    BalmJS.afterTask = setTask(name);
  }

  go(recipe: Function = BalmJS.noop): void {
    if (BalmJS.utils.isFunction(recipe)) {
      registerTasks(recipe);
    } else {
      BalmJS.logger.error(
        'initialization',
        'BalmJS API: `balm.go(function(mix) {});`'
      );
    }
  }

  reset(): void {
    BalmJS.tasks = new Map();
    BalmJS.recipes = [];
    BalmJS.recipeIndex = 0;

    BalmJS.beforeTask = undefined;
    BalmJS.afterTask = undefined;

    BalmJS.config.useDefaults = true;
  }
}

export default Balm;
