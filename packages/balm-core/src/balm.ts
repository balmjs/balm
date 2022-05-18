import './config/index.js';
import './utilities/index.js';
import './plugins/index.js';
import registerTasks from './tasks/index.js';
import { setConfig, setTask } from './bootstrap/index.js';
import loading from './utilities/loading.js';
import { DeepPartial, BalmConfig } from '@balm-core/index';

class Balm {
  #config: any;

  constructor() {
    this.#config = setConfig({});

    if (!BalmJS.useCacache) {
      BalmJS.loading = false;
      loading.succeed();
    }
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

  go(recipe: Function = NOOP): void {
    if (BalmJS.utils.isFunction(recipe)) {
      registerTasks(recipe);
    } else {
      BalmJS.logger.error(
        'initialization',
        'BalmJS API: `balm.go(mix => {});`'
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
