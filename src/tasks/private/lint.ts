class LintTask extends BalmJS.BalmTask {
  constructor() {
    super('lint');

    this.defaultOutput = BalmJS.config.src.js;
    this.defaultInput = `${this.defaultOutput}/**/*.js`; // TODO: more ext
  }

  fn = (): any => {
    this.init();

    return this.src
      .pipe($.eslint({ fix: true }))
      .pipe(server.reload({ stream: true, once: true }))
      .pipe($.eslint.format())
      .pipe($.if(!server.active, $.eslint.failAfterError()))
      .pipe(gulp.dest(BalmJS.file.absPaths(this.output)));
  };
}

export default LintTask;
