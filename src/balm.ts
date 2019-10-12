import pkg from '../package.json';
import './config';
import './utilities';
import './plugins';
import registerTasks from './tasks';
import { setConfig, checkTask } from './bootstrap';

class Balm {
  private _config: any;

  constructor() {
    console.log(`BalmJS version: ${pkg.version}`);
    this._config = BalmJS.config;
  }

  get config(): any {
    return this._config;
  }
  set config(value: any) {
    this._config = setConfig(value);
    BalmJS.config = this._config;
  }

  set beforeTask(name: string | Function) {
    const task = checkTask(name);
    if (task) {
      BalmJS.beforeTask = task;
    }
  }
  set afterTask(name: string | Function) {
    const task = checkTask(name);
    if (task) {
      BalmJS.afterTask = task;
    }
  }

  go(recipe: Function = BalmJS.noop): void {
    if (BalmJS.utils.isFunction(recipe)) {
      if (!(BalmJS.config.src && BalmJS.config.dest)) {
        this.config = {};
      }

      registerTasks(recipe);
    } else {
      BalmJS.logger.error(
        'initialization',
        'BalmJS API: `balm.go(function(mix) {});`'
      );
    }
  }
}

export default Balm;
