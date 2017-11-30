class Lint extends Task {
  constructor() {
    super('lint');
  }

  lint(files) {
    return gulp
      .src(files)
      .pipe($.eslint({ fix: true }))
      .pipe(browserSync.stream({ once: true }))
      .pipe($.eslint.format())
      .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
  }

  get fn() {
    return () => {
      return this.lint(`${config.source.js}/**/*.js`).pipe(
        gulp.dest(config.source.js)
      );
    };
  }
}

export default Lint;
