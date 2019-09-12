class LintTask extends BalmJS.BalmTask {
  constructor() {
    super('lint');

    this.defaultInput = `${BalmJS.config.source.js}/**/*.js`; // TODO: ext
    this.defaultOutput = BalmJS.config.source.js;
  }

  fn(cb: Function): void {
    this.init();

    gulp
      .src(this.input)
      .pipe($.eslint({ fix: true }))
      // .pipe(server.reload({ stream: true, once: true }))
      .pipe($.eslint.format())
      // .pipe($.if(!server.active, $.eslint.failAfterError()))
      .pipe(gulp.dest(this.output));
    cb();
  }
}

export = LintTask;
