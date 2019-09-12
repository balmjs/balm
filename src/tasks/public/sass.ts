class SassTask extends BalmJS.StyleTask {
  constructor() {
    super('sass');

    this.defaultInput = path.join(
      BalmJS.config.roots.source,
      BalmJS.config.paths.source.css,
      '**',
      '!(_*).scss'
    );
  }

  get options(): object {
    return Object.assign(
      {
        outputStyle: 'expanded',
        precision: 10,
        includePaths: BalmJS.file.stylePaths()
      },
      BalmJS.config.styles.sassOptions
    );
  }

  recipe = (input?: string | string[], output?: string): void => {
    this.init(input, output);

    this.handleStyle(this.name, this.output, this.options);
  };

  fn = (cb: Function): void => {
    this.recipe();
    cb();
  };
}

export = SassTask;
