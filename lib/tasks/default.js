/* eslint no-console: 0 */
import runSequence from 'run-sequence';
import { isString, isFunction } from '../utilities';

const TIME = 'BalmJS Time';
const BEFORE_TASK_NAME = 'before';
const START_TASK_NAME = 'start';
const END_TASK_NAME = 'end';
const AFTER_TASK_NAME = 'after';

class Default extends BalmTask {
  constructor() {
    super('default');

    let taskName = config.cache ? 'cache' : 'build';
    this.buildTask = config.production ? taskName : 'serve';

    this.beforeStart();
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

  beforeStart() {
    let startTaskDeps = isString(BalmJS.beforeTask) ? [BalmJS.beforeTask] : [];

    task(getNamespace(START_TASK_NAME), startTaskDeps, () => {
      console.time(TIME);
      if (isFunction(BalmJS.beforeTask)) {
        BalmJS.beforeTask();
      }
    });

    task(getNamespace(BEFORE_TASK_NAME), callback => {
      let spriteTasks = this.getSpriteTasks();
      let beforeTasks = [START_TASK_NAME, 'clean', 'wiredep'];
      if (spriteTasks.length) {
        beforeTasks = beforeTasks.concat(spriteTasks);
      }

      beforeTasks = getNamespace(beforeTasks);

      runSequence.apply(this, beforeTasks.concat([callback]));
    });
  }

  afterEnd() {
    let endTaskName = getNamespace(END_TASK_NAME);
    let endTaskDeps = isString(BalmJS.afterTask) ? [BalmJS.afterTask] : [];
    let afterTaskDeps = config.useDefault ? getNamespace([this.buildTask]) : [];

    task(endTaskName, endTaskDeps, () => {
      if (isFunction(BalmJS.afterTask)) {
        BalmJS.afterTask();
      }
      console.timeEnd(TIME);
    });

    task(getNamespace(AFTER_TASK_NAME), afterTaskDeps, callback => {
      if (BalmJS.recipes.length) {
        runSequence.apply(this, BalmJS.recipes.concat([endTaskName, callback]));
      } else {
        runSequence.apply(this, [endTaskName, callback]);
      }
    });
  }

  get deps() {
    let defaultDeps = config.useDefault
      ? [BEFORE_TASK_NAME]
      : [START_TASK_NAME];

    return config.ssr ? [] : defaultDeps;
  }

  get fn() {
    return () => {
      if (config.ssr) {
        gulp.start(getNamespace('webpack'));
      } else {
        this.afterEnd();

        gulp.start(getNamespace(AFTER_TASK_NAME));
      }
    };
  }
}

export default Default;
