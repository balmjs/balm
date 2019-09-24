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

    BalmJS.logger.info(
      `${this.name} task`,
      `'${developmentPath}' => '${productionPath}'`,
      {
        logLevel: BalmJS.LogLevel.Debug
      }
    );

    return $.replace(developmentPath, productionPath);
  }

  fn(): void {
    this.init();

    gulp
      .src(BalmJS.file.absPaths(this.input))
      .pipe(this.urlProcessing('img'))
      .pipe(this.urlProcessing('font'))
      .pipe(gulp.dest(BalmJS.file.absPaths(this.output)));
  }
}

export default UrlTask;
