class LessTask extends BalmJS.BalmStyleTask {
  constructor() {
    super('less');
  }

  get options(): {
    paths: string[];
    plugins?: object[];
  } {
    return Object.assign(
      {
        paths: BalmJS.file.stylePaths
      },
      BalmJS.config.styles.lessOptions
    );
  }

  recipe(input?: string | string[], output?: string): void {
    this.init(input, output);

    this.handleStyle(this.name, this.output, this.options);
  }

  fn(): void {
    this.recipe();
  }
}

export = LessTask;
