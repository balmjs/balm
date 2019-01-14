class LintTask extends BalmTask {
  constructor() {
    super('lint');

    this.input = `${config.source.js}/**/*.js`;
    this.output = config.source.js;
  }

  get fn() {
    return () => {
      return src(this.input)
        .pipe($.eslint({ fix: true }))
        .pipe(browserSync.stream({ once: true }))
        .pipe($.eslint.format())
        .pipe($.if(!browserSync.active, $.eslint.failAfterError()))
        .pipe(dest(this.output));
    };
  }
}

export default LintTask;
