class Wiredep {
  get name() {
    return 'wiredep';
  }
  get deps() {
    return [];
  }
  get fn() {
    // inject bower components
    return () => {
      gulp.src(config.app.css + '/*.{scss,less}')
        .pipe(wiredep({
          ignorePath: /^(\.\.\/)+/
        }))
        .pipe(gulp.dest(config.app.css));

      gulp.src(config.app.base + '/*.html')
        .pipe(wiredep({
          exclude: ['bootstrap-sass'],
          ignorePath: /^(\.\.\/)*\.\./
        }))
        .pipe(gulp.dest(config.app.base));
    };
  }
}

export default Wiredep;
