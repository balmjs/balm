class Build {
  get name() {
    return 'build';
  }
  get deps() {
    let tasks = ['lint'];
    if (config.project === 'static') {
      tasks.push('html');
    } else {
      tasks.push('styles');
      tasks.push('scripts');
    }
    tasks.push('images');
    tasks.push('fonts');
    tasks.push('extras');
    return tasks;
  }
  get fn() {
    return () => {
      return gulp.src(config.dist.base + '/**/*').pipe($.size({
        title: 'build',
        gzip: true
      }));
    };
  }
}

export default Build;
