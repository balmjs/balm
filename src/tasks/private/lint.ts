class LintTask extends BalmJS.BalmTask {
  constructor() {
    super('lint');

    this.defaultInput = `${BalmJS.config.src.js}/**/*.js`; // TODO: more ext
    this.defaultOutput = BalmJS.config.src.js;
  }

  fn(): void {
    this.init();

    gulp
      .src(BalmJS.file.absPaths(this.input))
      .pipe($.eslint({ fix: true }))
      .pipe(server.reload({ stream: true, once: true }))
      .pipe($.eslint.format())
      .pipe($.if(!server.active, $.eslint.failAfterError()))
      .pipe(gulp.dest(BalmJS.file.absPaths(this.output)));
  }
}

export = LintTask;
