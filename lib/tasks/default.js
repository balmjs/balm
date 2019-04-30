import Style from './private/style';
import Html from './private/html';
import Build from './private/build';
import Server from './private/server';
import { isString } from '../utilities';

class DefaultTask extends BalmTask {
  constructor() {
    super('default');

    let balmTasks = toNamespace(this.deps);

    if (isString(BalmJS.beforeTask)) {
      balmTasks.unshift(BalmJS.beforeTask);
    }

    if (isString(BalmJS.afterTask)) {
      balmTasks.push(BalmJS.afterTask);
    }

    this.tasks = balmTasks;
  }

  get mainTasks() {
    let tasks = ['clean', 'wiredep'];

    if (config.sprites.image.length) {
      tasks.push('sprites');
    }

    if (config.scripts.eslint) {
      tasks.push('lint');
    }

    if (config.isProd) {
      tasks = tasks.concat(new Style().deps);
      tasks = tasks.concat(new Html().deps);
      tasks = tasks.concat(new Build().deps);
      tasks.push('build');

      if (config.cache) {
        tasks.push('cache');
      }

      if (config.pwa.enabled) {
        tasks.push('pwa');
      }
    } else {
      tasks = tasks.concat(new Server().deps);
      tasks.push('serve');
    }

    return tasks;
  }

  get deps() {
    let tasks = ['start'];

    if (config.useDefault) {
      tasks = tasks.concat(this.mainTasks);
    }

    if (BalmJS.recipes.length) {
      tasks = tasks.concat(BalmJS.recipes);
    }

    tasks.push('end');

    return config.inSSR ? ['scripts'] : tasks;
  }
}

export default DefaultTask;
