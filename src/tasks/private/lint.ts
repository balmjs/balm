class LintTask extends BalmJS.BalmTask {
  constructor() {
    super('lint');

    this.defaultInput = `${BalmJS.config.src.js}/**/*.js`; // TODO: more ext
    this.defaultOutput = BalmJS.config.src.js;
  }

  fn = (): void => {
    this.init();

    gulp
      .src(this.input)
      .pipe($.eslint({ fix: true }))
      .pipe(server.reload({ stream: true, once: true }))
      .pipe($.eslint.format())
      .pipe($.if(!server.active, $.eslint.failAfterError()))
      .pipe(gulp.dest(this.output));
  };
}

export = LintTask;
