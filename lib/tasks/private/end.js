/* eslint no-console: 0 */
import { isFunction } from '../../utilities';

class EndTask extends BalmTask {
  constructor() {
    super('end');
  }

  get fn() {
    return cb => {
      if (isFunction(BalmJS.afterTask)) {
        BalmJS.afterTask();
      }

      console.timeEnd(BalmJS.TIME_FLAG);

      cb();
    };
  }
}

export default EndTask;
