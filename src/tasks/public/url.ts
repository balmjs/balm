class UrlTask extends BalmJS.BalmTask {
  constructor() {
    super('url');

    this.defaultOutput = BalmJS.config.dest.css;
    this.defaultInput = `${this.defaultOutput}/**/*.css`;
  }

  private _urlProcessing(type: string): any {
    const pattern: string = (BalmJS.config.paths.source as any)[type]
      .split('/')
      .pop();
    const pathSrc = new RegExp(`\\.{2}/${pattern}/`, 'g');
    const pathDest = `../${(BalmJS.config.paths.target as any)[type]}/`;

    BalmJS.logger.debug(
      `${this.name} task`,
      {
        regex: pathSrc,
        replacement: pathDest
      },
      {
        pre: true
      }
    );

    return $.replace(pathSrc, pathDest);
  }

  recipe(input?: string | string[], output?: string): any {
    return (): any => {
      this.init(input, output);

      return this.src
        .pipe(this._urlProcessing('img'))
        .pipe(this._urlProcessing('font'))
        .pipe(gulp.dest(BalmJS.file.absPath(this.output)));
    };
  }

  get fn(): any {
    return this.recipe();
  }
}

export default UrlTask;
