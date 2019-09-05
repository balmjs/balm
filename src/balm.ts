import './config';
import './utilities';
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
    BalmJS.config = setConfig(value);
    this._config = BalmJS.config;
  }

  set beforeTask(name: string) {
    const _task = checkGulpTask(name);
    if (_task) {
      BalmJS.beforeTask = _task;
    }
  }
  set afterTask(name: string) {
    const _task = checkGulpTask(name);
    if (_task) {
      BalmJS.afterTask = _task;
    }
  }

  go(): void {
    registerTasks();

    console.log('gg');
  }
}

export default Balm;
