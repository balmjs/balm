/* eslint no-console: 0 */
import { isString, isFunction } from '../utilities';

const BALM_TASK_TIME = 'BalmJS Time';
const BEFORE_BALM_TASK_NAME = 'before';
const START_BALM_TASK_NAME = 'start';
const END_BALM_TASK_NAME = 'end';
const AFTER_BALM_TASK_NAME = 'after';

class Default extends BalmTask {
  constructor() {
    super('default');

    this.startTask();
  }

  getSpriteTasks() {
    let tasks = [];

    if (config.sprites.image.length) {
      tasks.push('sprites');
    }
    if (config.sprites.svg.length) {
      tasks.push('svg');
    }

    return tasks;
  }

  beforeTask() {
    return isString(BalmJS.beforeTask) || isFunction(BalmJS.beforeTask)
      ? series(BalmJS.beforeTask)
      : BalmJS.noop;
  }

  startTask() {
    task(getNamespace(BEFORE_BALM_TASK_NAME), callback => {
      console.time(BALM_TASK_TIME);

      this.beforeTask();
      callback();
    });

    task(getNamespace(START_BALM_TASK_NAME), callback => {
      let beforeTasks = [BEFORE_BALM_TASK_NAME, 'clean', 'wiredep'];

      let spriteTasks = this.getSpriteTasks();
      if (spriteTasks.length) {
        beforeTasks = beforeTasks.concat(spriteTasks);
      }

      beforeTasks = getNamespace(beforeTasks);

      series(beforeTasks);
      callback();
    });
  }

  endTask() {
    let buildTask = config.cache ? 'cache' : 'build';
    let balmTask = config.production ? buildTask : 'serve';

    return config.useDefault ? getNamespace([balmTask]) : [];
  }

  afterTask() {
    const endTask = () => {
      console.timeEnd(BALM_TASK_TIME);
    };

    return isString(BalmJS.afterTask) || isFunction(BalmJS.afterTask)
      ? series(BalmJS.afterTask, endTask)
      : endTask;
  }

  runTask() {
    let afterTaskName = getNamespace(AFTER_BALM_TASK_NAME);

    task(afterTaskName, callback => {
      this.afterTask();
      callback();
    });

    task(getNamespace(END_BALM_TASK_NAME), callback => {
      let tasks = this.endTask();
      if (BalmJS.recipes.length) {
        tasks.concat(BalmJS.recipes, afterTaskName);
      } else {
        tasks.push(afterTaskName);
      }

      series(tasks);
      callback();
    });
  }

  get deps() {
    let defaultDeps = config.useDefault
      ? [START_BALM_TASK_NAME]
      : [BEFORE_BALM_TASK_NAME];

    return config.ssr ? [] : defaultDeps;
  }

  get fn() {
    return callback => {
      if (config.ssr) {
        // gulp.start(getNamespace('webpack'));
      } else {
        this.runTask();

        // gulp.start(getNamespace(END_BALM_TASK_NAME));
      }
      callback();
    };
  }
}

export default Default;
