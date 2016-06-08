class Build {
  get name() {
    return 'build';
  }
  get deps() {
    let tasks = ['lint'];
    if (!config.static) {
      tasks.push('styles');
      tasks.push('scripts');
    } else {
      tasks.push('html');
    }
    tasks.push('images');
    tasks.push('fonts');
    tasks.push('extras');

    return tasks;
  }
  get fn() {
    return () => {
      return gulp.src(config.target.base + '/**/*').pipe($.size({
        title: 'build',
        gzip: true
      }));
    };
  }
}

export default Build;
