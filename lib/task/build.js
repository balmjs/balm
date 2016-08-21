class Build extends Task {
  constructor() {
    super('build');
  }
  get deps() {
    let tasks = ['html', 'images', 'fonts'];

    if (config.scripts.eslint) {
      tasks.unshift('lint');
    }

    if (config.static) {
      tasks.push('extras');
    }

    return tasks;
  }
  get fn() {
    return () => {
      return gulp.src(config.target.base + '/**/*')
        .pipe($.size({
          title: 'build',
          gzip: true
        }));
    };
  }
}

export default Build;
