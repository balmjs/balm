class UrlTask extends BalmJS.BalmTask {
  constructor() {
    super('url');

    this.defaultOutput = BalmJS.config.dest.css;
    this.defaultInput = BalmJS.file.matchAllFiles(this.defaultOutput, '*.css');
  }

  #urlProcessing = (type: string): any => {
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

    return BalmJS.plugins.replace(pathSrc, pathDest);
  };

  recipe(input?: string | string[], output?: string): Function {
    const balmUrl = (): any => {
      this.init(input, output);

      return this.src
        .pipe(this.#urlProcessing('img'))
        .pipe(this.#urlProcessing('font'))
        .pipe(gulp.dest(this.output));
    };

    return balmUrl;
  }

  get fn(): Function {
    return this.recipe();
  }
}

export default UrlTask;
