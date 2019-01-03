import Style from './style';
import Html from './html';
import Build from './build';
import Server from './server';

class Default extends BalmTask {
  constructor() {
    super('default');
  }

  get mainTasks() {
    let tasks = ['clean', 'wiredep'];

    if (config.sprites.image.length) {
      tasks.push('sprites');
    }

    if (config.production) {
      tasks = tasks.concat(new Style().deps);
      tasks = tasks.concat(new Html().deps);
      tasks = tasks.concat(new Build().deps);
      tasks.push('build');

      if (config.cache) {
        tasks.push('cache');
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

    tasks.push('end');

    return tasks; // TODO: ssr
  }
}

export default Default;
