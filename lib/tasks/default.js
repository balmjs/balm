/* eslint no-console: 0 */
import runSequence from 'run-sequence';

const TIME = 'BalmJS Time';
const BEFORE_TASK_NAME = 'before';
const START_TASK_NAME = 'start';
const END_TASK_NAME = 'end';
const AFTER_TASK_NAME = 'after';

class Default extends Task {
  constructor() {
    super('default');

    const taskName = config.cache ? 'cache' : 'build';
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
    gulp.task(getNamespace(START_TASK_NAME), () => {
      console.time(TIME);
      BalmJS.beforeTask();
    });

    gulp.task(getNamespace(BEFORE_TASK_NAME), callback => {
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
    const endTaskName = getNamespace(END_TASK_NAME);
    const deps = config.useDefault ? getNamespace([this.buildTask]) : [];

    gulp.task(endTaskName, () => {
      BalmJS.afterTask();
      console.timeEnd(TIME);
    });

    gulp.task(getNamespace(AFTER_TASK_NAME), deps, callback => {
      if (BalmJS.recipes.length) {
        runSequence.apply(this, BalmJS.recipes.concat([endTaskName, callback]));
      } else {
        runSequence.apply(this, [endTaskName, callback]);
      }
    });
  }

  get deps() {
    return config.useDefault ? [BEFORE_TASK_NAME] : [START_TASK_NAME];
  }

  get fn() {
    return () => {
      this.afterEnd();

      gulp.start(getNamespace(AFTER_TASK_NAME));
    };
  }
}

export default Default;
