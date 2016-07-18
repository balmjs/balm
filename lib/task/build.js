class Build extends Task {
  constructor() {
    super('build');
  }
  get deps() {
    let tasks = ['lint', 'html', 'images', 'fonts'];

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
