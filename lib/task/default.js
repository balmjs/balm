class Default extends BalmJS.Task {
  constructor() {
    super('default');

    this.beforeStart();

    this.buildTask = config.production ?
      (config.cache ? 'version' : 'build') : 'serve';
  }
  beforeStart() {
    let deps = config.production ? ['clean'] :
      this.getSpriteTasks(true);

    gulp.task('task:before', deps);
  }
  afterEnd() {
    gulp.task('task:after', [this.buildTask], () => {
      require('run-sequence').apply(this, BalmJS.recipes);
    });
  }
  get deps() {
    return ['task:before'];
  }
  get fn() {
    return () => {
      if (BalmJS.recipes.length) {
        this.afterEnd();
        gulp.start('task:after');
      } else {
        gulp.start(this.buildTask);
      }
    };
  }
}

export default Default;
