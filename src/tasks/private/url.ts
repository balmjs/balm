class UrlTask extends BalmJS.BalmTask {
  constructor() {
    super('url');

    this.defaultInput = `${BalmJS.config.dest.css}/**/*.css`;
    this.defaultOutput = BalmJS.config.dest.css;
  }

  private _urlProcessing(type: string): any {
    const pathSrc = new RegExp(
      `\\.{2}/${BalmJS.config.paths.source[type].split('/').pop()}/`,
      'g'
    );
    const pathDest = `../${BalmJS.config.paths.target[type]}/`;

    BalmJS.logger.info(`${this.name} task`, `'${pathSrc}' => '${pathDest}'`, {
      logLevel: BalmJS.LogLevel.Debug
    });

    return $.replace(pathSrc, pathDest);
  }

  fn(): void {
    this.init();

    gulp
      .src(BalmJS.file.absPaths(this.input))
      .pipe(this._urlProcessing('img'))
      .pipe(this._urlProcessing('font'))
      .pipe(gulp.dest(BalmJS.file.absPaths(this.output)));
  }
}

export default UrlTask;
