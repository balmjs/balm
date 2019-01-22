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
        .pipe(server.reload({ stream: true, once: true }))
        .pipe($.eslint.format())
        .pipe($.if(!server.active, $.eslint.failAfterError()))
        .pipe(dest(this.output));
    };
  }
}

export default LintTask;
