import Style from './private/style';
import Html from './private/html';
import Build from './private/build';
import Server from './private/server';
import Pwa from './next/pwa';
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
    let tasks = [
      'clean',
      ...(config.static ? ['wiredep'] : []),
      ...(config.sprites.image.length ? ['sprites'] : []),
      ...(config.scripts.eslint ? ['lint'] : [])
    ];

    if (config.isProd) {
      tasks = [
        ...tasks,
        ...new Style().deps,
        ...new Html().deps,
        ...new Build().deps,
        'build',
        ...(config.cache ? ['cache'] : []),
        ...(config.pwa.enabled ? [...new Pwa().deps, 'pwa'] : [])
      ];
    } else {
      tasks = [
        ...tasks,
        ...new Server().deps,
        ...(config.pwa.enabled ? [...new Pwa().deps, 'pwa'] : []),
        'serve'
      ];
    }

    return tasks;
  }

  get deps() {
    let tasks = [
      'start',
      ...(config.useDefault ? this.mainTasks : []),
      ...(BalmJS.recipes.length ? BalmJS.recipes : []),
      'end'
    ];

    return config.inSSR ? ['scripts'] : tasks;
  }
}

export default DefaultTask;
