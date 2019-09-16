class UrlTask extends BalmJS.BalmTask {
  constructor() {
    super('url');

    this.defaultInput = `${BalmJS.config.dest.css}/**/*.css`;
    this.defaultOutput = BalmJS.config.dest.css;
  }

  urlProcessing(type: string): any {
    const developmentPath = new RegExp(
      `\\.{2}/${BalmJS.config.paths.source[type].split('/').pop()}/`,
      'g'
    );
    const productionPath = `../${BalmJS.config.paths.target[type]}/`;

    if (BalmJS.config.logs.level === BalmJS.LogLevel.Debug) {
      BalmJS.logger.info(
        `<${this.name} task>`,
        `from '${developmentPath}' to '${productionPath}'`
      );
    }

    return $.replace(developmentPath, productionPath);
  }

  fn(cb: Function): void {
    this.init();

    gulp
      .src(this.input)
      .pipe(this.urlProcessing('img'))
      .pipe(this.urlProcessing('font'))
      .pipe(gulp.dest(this.output));

    cb();
  }
}

export = UrlTask;
