class Lint extends Task {
  constructor() {
    super('lint');
  }
  jsLint(files, options) {
    return gulp.src(files)
      .pipe(reload({
        stream: true,
        once: true
      }))
      .pipe($.eslint(options))
      .pipe($.eslint.format())
      .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
  }
  get fn() {
    return () => {
      return this.jsLint(config.tmp.js + '/**/*.js', { fix: true })
        .pipe(gulp.dest(config.tmp.js));
    };
  }
}

export default Lint;
