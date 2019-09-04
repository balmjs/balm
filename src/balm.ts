import './config';
import './utilities';
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
  }

  set beforeTask(name: string) {
    const _task = checkGulpTask(name);
    if (_task) {
      BalmJS.BeforeTask = _task;
    }
  }
  set afterTask(name: string) {
    const _task = checkGulpTask(name);
    if (_task) {
      BalmJS.AfterTask = _task;
    }
  }

  go(): void {
    console.log('gg');
  }
}

export default Balm;
