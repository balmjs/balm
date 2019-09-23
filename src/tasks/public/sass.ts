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
      BalmJS.config.styles.sassOptions,
      this.customOptions
    );
  }

  recipe(
    input?: string | string[],
    output?: string,
    customOptions?: object
  ): void {
    this.init(input, output, customOptions);

    this.handleStyle(this.name, this.output, this.options);
  }

  fn(): void {
    this.recipe();
  }
}

export = SassTask;
