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
      gulp.src(config.app.css + '/*.{sass,scss,less}')
        .pipe(wiredep({
          ignorePath: /^(\.\.\/)+/
        }))
        .pipe(gulp.dest(config.app.css));

      gulp.src(config.app.html + '/*.html')
        .pipe(wiredep({
          exclude: ['bootstrap-sass'],
          ignorePath: /^(\.\.\/)*\.\./
        }))
        .pipe(gulp.dest(config.app.html));
    };
  }
}

export default Wiredep;
