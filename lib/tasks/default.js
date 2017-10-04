import runSequence from 'run-sequence';

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
    gulp.task('task:before', () => {
      return new Promise(resolve => {
        config.beforeTask();
        runSequence([
          'clean', 'wiredep'
        ], this.getSpriteTasks(), resolve);
      });
    });
  }
  afterEnd() {
    let deps = config.useDefault
      ? [this.buildTask]
      : [];

    gulp.task('task:after', deps, callback => {
      return new Promise(resolve => {
        if (BalmJS.recipes.length || !config.useDefault) {
          runSequence(BalmJS.recipes.concat(callback), resolve);
        } else {
          resolve();
        }
        config.afterTask();
      });
    });
  }
  get deps() {
    let tasks = config.useDefault
      ? ['task:before']
      : [];

    return tasks;
  }
  get fn() {
    return () => {
      this.afterEnd();

      gulp.start('task:after');
    };
  }
}

export default Default;
