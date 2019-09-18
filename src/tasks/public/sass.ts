class SassTask extends BalmJS.BalmStyleTask {
  constructor() {
    super('sass');
  }

  get options(): object {
    return Object.assign(
      {
        includePaths: BalmJS.file.stylePaths(),
        outputStyle: 'expanded'
      },
      BalmJS.config.styles.sassOptions
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

export = SassTask;
