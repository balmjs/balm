class SassTask extends BalmJS.BalmStyleTask {
  constructor() {
    super('sass');
  }

  get options(): object {
    return Object.assign(
      {
        includePaths: BalmJS.file.stylePaths,
        outputStyle: 'expanded'
      },
      BalmJS.config.styles.sassOptions,
      this.customOptions
    );
  }

  recipe(
    input?: string | string[],
    output?: string,
    sassOptions?: object,
    gulpSrcOptions?: object
  ): any {
    return (): any => {
      this.init(input, output, sassOptions, gulpSrcOptions);

      return this.handleStyle(this.name, this.output, this.options);
    };
  }

  get fn(): any {
    return this.recipe();
  }
}

export default SassTask;
