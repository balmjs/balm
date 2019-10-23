class LintTask extends BalmJS.BalmTask {
  constructor() {
    super('lint');

    this.defaultOutput = BalmJS.config.src.js;
    this.defaultInput = BalmJS.file.matchAllFiles(this.defaultOutput, '*.js');
  }

  fn = (): any => {
    this.init();

    return this.src
      .pipe($.eslint({ fix: true }))
      .pipe(server.reload({ stream: true, once: true }))
      .pipe($.eslint.format())
      .pipe($.if(!server.active, $.eslint.failAfterError()))
      .pipe(gulp.dest(BalmJS.file.absPath(this.output)));
  };
}

export default LintTask;
