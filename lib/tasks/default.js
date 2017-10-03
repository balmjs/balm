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
  beforeStart() {
    let deps = config.production
      ? ['clean']
      : this.getSpriteTasks(true);

    gulp.task('task:before', deps, config.beforeTask);
  }
  afterEnd() {
    let deps = config.useDefault
      ? [this.buildTask]
      : [];

    gulp.task('task:after', deps, callback => {
      if (BalmJS.recipes.length) {
        runSequence.apply(this, BalmJS.recipes.concat(callback));
      }
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
      gulp.doneCallback = config.afterTask;

      let taskName = (BalmJS.recipes.length || !config.useDefault)
        ? 'task:after'
        : this.buildTask;

      gulp.start(taskName);
    };
  }
}

export default Default;
