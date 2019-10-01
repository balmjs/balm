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
    customOptions?: object
  ): any {
    return (): any => {
      this.init(input, output, customOptions);

      return this.handleStyle(this.name, this.output, this.options);
    };
  }

  get fn(): any {
    return this.recipe();
  }
}

export default LessTask;
