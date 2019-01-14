/* eslint no-console: 0 */
import { isFunction } from '../../utilities';

class StartTask extends BalmTask {
  constructor() {
    super('start');
  }

  get fn() {
    return cb => {
      console.time(BalmJS.TIME_FLAG);

      if (isFunction(BalmJS.beforeTask)) {
        BalmJS.beforeTask();
      }

      cb();
    };
  }
}

export default StartTask;
