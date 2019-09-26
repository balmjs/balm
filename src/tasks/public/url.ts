class UrlTask extends BalmJS.BalmTask {
  constructor() {
    super('url');

    this.defaultOutput = BalmJS.config.dest.css;
    this.defaultInput = `${this.defaultOutput}/**/*.css`;
  }

  private _urlProcessing(type: string): any {
    const pattern = BalmJS.config.paths.source[type].split('/').pop();
    const pathSrc = new RegExp(`\\.{2}/${pattern}/`, 'g');
    const pathDest = `../${BalmJS.config.paths.target[type]}/`;

    BalmJS.logger.info(
      `${this.name} task`,
      {
        regex: pathSrc,
        replacement: pathDest
      },
      {
        logLevel: BalmJS.LogLevel.Debug,
        pre: true
      }
    );

    return $.replace(pathSrc, pathDest);
  }

  recipe(input?: string | string[], output?: string): any {
    this.init(input, output);

    this.src
      .pipe(this._urlProcessing('img'))
      .pipe(this._urlProcessing('font'))
      .pipe(gulp.dest(BalmJS.file.absPaths(this.output)));
  }

  fn(): void {
    this.recipe();
  }
}

export default UrlTask;
