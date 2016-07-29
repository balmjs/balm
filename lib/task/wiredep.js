class Wiredep extends Task {
  constructor() {
    super('wiredep');
  }
  get fn() {
    // inject bower components
    return () => {
      gulp.src(config.source.css + '/**/*')
        .pipe(wiredep({
          cwd: config.workspace,
          ignorePath: /^(\.\.\/)+/
        }))
        .pipe(gulp.dest(config.source.css));

      gulp.src(config.source.html + '/*.html')
        .pipe(wiredep({
          cwd: config.workspace,
          exclude: ['bootstrap-sass'],
          ignorePath: /^(\.\.\/)*\.\./
        }))
        .pipe(gulp.dest(config.source.html));
    };
  }
}

export default Wiredep;
