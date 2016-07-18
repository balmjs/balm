class Extra extends Task {
  constructor() {
    super('extras');
  }
  get fn() {
    return () => {
      return gulp.src([
        config.source.base + '/*.*',
        '!' + config.source.html + '/*.html'
      ], {
        dot: true
      }).pipe(gulp.dest(config.target.base));
    };
  }
}

export default Extra;
