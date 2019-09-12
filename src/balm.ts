import './config';
import './utilities';
import './plugins';
import registerTasks from './tasks';
import { setConfig, checkGulpTask } from './bootstrap';

class Balm {
  private _config: any;

  constructor() {
    this._config = BalmJS.config;
  }

  get config(): any {
    return this._config;
  }
  set config(value: any) {
    this._config = setConfig(value);
    BalmJS.config = this._config;
  }

  set beforeTask(name: string) {
    const task = checkGulpTask(name);
    if (task) {
      BalmJS.beforeTask = task;
    }
  }
  set afterTask(name: string) {
    const task = checkGulpTask(name);
    if (task) {
      BalmJS.afterTask = task;
    }
  }

  go(recipe: Function = BalmJS.noop): void {
    if (BalmJS.utils.isFunction(recipe)) {
      registerTasks(recipe);
    } else {
      BalmJS.logger.error(
        '<initialization>',
        'BalmJS API: `balm.go(function(mix) {});`'
      );
    }
  }
}

export default Balm;
