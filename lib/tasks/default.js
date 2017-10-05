/* eslint no-console: 0 */
import runSequence from 'run-sequence';

const TIME = 'BalmJS Time';

class Default extends Task {
  constructor() {
    super('default');

    this.beforeStart();

    let taskName = config.cache
      ? 'cache'
      : 'build';
    this.buildTask = config.production
      ? taskName
      : 'serve';
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
    gulp.task('start', () => {
      console.time(TIME);
      config.beforeTask();
    });

    gulp.task('task:before', () => {
      return new Promise(resolve => {
        runSequence('start', [
          'clean', 'wiredep'
        ], this.getSpriteTasks(), resolve);
      });
    });
  }
  afterEnd() {
    let deps = config.useDefault
      ? [this.buildTask]
      : [];

    gulp.task('end', () => {
      config.afterTask();
      console.timeEnd(TIME);
    });

    gulp.task('task:after', deps, callback => {
      if (BalmJS.recipes.length) {
        runSequence.apply(this, BalmJS.recipes.concat(['end', callback]));
      } else {
        runSequence.apply(this, ['end', callback]);
      }
    });
  }
  get deps() {
    return config.useDefault
      ? ['task:before']
      : ['start'];
  }
  get fn() {
    return () => {
      this.afterEnd();

      gulp.start('task:after');
    };
  }
}

export default Default;
