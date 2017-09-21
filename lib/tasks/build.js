class Build extends BalmJS.Task {
  constructor() {
    super('build');
  }
  get deps() {
    let tasks = ['lint', 'html', 'images', 'media', 'fonts'];

    if (!config.scripts.eslint) {
      tasks.shift();
    }

    if (config.static) {
      tasks.push('extras');
    }

    return tasks;
  }
  get fn() {
    return () => {
      return gulp.src(`${config.target.base}/**/*`)
        .pipe($.size({
          title: this.name,
          gzip: true
        }));
    };
  }
}

export default Build;
