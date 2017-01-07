class Lint extends BalmJS.Task {
  constructor() {
    super('lint');
  }
  jsLint(files, options) {
    return gulp.src(files)
      .pipe(browserSync.stream({once: true}))
      .pipe($.eslint(options))
      .pipe($.eslint.format())
      .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
  }
  get fn() {
    return () => {
      return this.jsLint(config.source.js + '/**/*.js', {fix: true})
        .pipe(gulp.dest(config.source.js));
    };
  }
}

export default Lint;
