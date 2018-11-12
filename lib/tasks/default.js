/* eslint no-console: 0 */
import { isString } from '../utilities';

class Default extends BalmTask {
  constructor() {
    super('default');
  }

  get startTask() {
    return isString(BalmJS.beforeTask) ? BalmJS.beforeTask : [];
  }

  get mainTask() {
    let tasks = ['clean', 'wiredep'];

    if (config.sprites.image.length) {
      tasks.push('sprites');
    }
    if (config.sprites.svg.length) {
      tasks.push('svg');
    }

    let buildTask = config.cache ? 'cache' : 'build';
    let balmTask = config.production ? buildTask : 'serve';

    return config.useDefault ? tasks.concat(balmTask) : tasks;
  }

  get endTask() {
    return isString(BalmJS.afterTask) ? BalmJS.afterTask : [];
  }

  get deps() {
    let tasks = ['start'].concat(this.startTask);

    if (config.useDefault) {
      tasks = tasks.concat(this.mainTask);
    }

    tasks = tasks.concat(this.endTask, 'end');

    return config.ssr ? [getNamespace('webpack')] : tasks;
  }
}

export default Default;
