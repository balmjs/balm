class Lint {
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
  get name() {
    return 'lint';
  }
  get deps() {
    return [];
  }
  get fn() {
    return () => {
      return this.jsLint(config.source.js + '/**/*.js', {
          fix: true
        })
        .pipe(gulp.dest(config.source.js));
    };
  }
}

export default Lint;
