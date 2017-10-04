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

    gulp.task('task:after', deps, () => {
      return new Promise(resolve => {
        if (BalmJS.recipes.length) {
          runSequence(BalmJS.recipes, 'end', resolve);
        } else {
          runSequence('end', resolve);
        }
      });
    });
  }
  get deps() {
    return ['task:before'];
  }
  get fn() {
    return () => {
      this.afterEnd();

      gulp.start('task:after');
    };
  }
}

export default Default;
