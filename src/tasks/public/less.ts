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
      BalmJS.config.styles.lessOptions,
      this.customOptions
    );
  }

  recipe(
    input?: string | string[],
    output?: string,
    lessOptions?: object,
    gulpSrcOptions?: object
  ): any {
    return (): any => {
      this.init(input, output, lessOptions, gulpSrcOptions);

      return this.handleStyle(this.name, this.output, this.options);
    };
  }

  get fn(): any {
    return this.recipe();
  }
}

export default LessTask;
