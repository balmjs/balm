class LessTask extends BalmJS.BalmStyleTask {
  constructor() {
    super('less');
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

    this.handleStyle(this.name, this.output, this.options);
  };

  fn = (cb: Function): void => {
    this.recipe();
    cb();
  };
}

export = LessTask;