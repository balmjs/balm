class LessTask extends BalmJS.StyleTask {
  constructor() {
    super('less');

    this.defaultInput = path.join(
      BalmJS.config.roots.source,
      BalmJS.config.paths.source.css,
      '**',
      '!(_*).less'
    );
  }

  get options(): object {
    return Object.assign(
      {
        paths: BalmJS.file.stylePaths
      },
      BalmJS.config.styles.lessOptions
    );
  }

  recipe = (input?: string | string[], output?: string): void => {
    this.init(input, output);

    if (BalmJS.config.logs.level === BalmJS.LogLevel.Debug) {
      BalmJS.logger.info('Less Task', {
        input: this.input,
        output: this.output
      });
    }

    const stream = gulp
      .src(BalmJS.file.absPaths(this.input))
      .pipe($.plumber(this.handleError))
      .pipe($.if(BalmJS.config.env.isDev, $.sourcemaps.init()))
      .pipe($.less(this.options));

    this.handleStyle(stream, this.output);
  };

  fn = (cb: Function): void => {
    this.recipe();
    cb();
  };
}

export = LessTask;
