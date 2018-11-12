/* eslint no-console: 0 */
import { isFunction } from '../utilities';

class Start extends BalmTask {
  constructor() {
    super('start');
  }

  get fn() {
    return cb => {
      console.time(BalmJS.TIME);

      if (isFunction(BalmJS.beforeTask)) {
        BalmJS.beforeTask();
      }

      cb();
    };
  }
}

export default Start;
