class SassTask extends BalmJS.StyleTask {
  constructor() {
    super('sass');
  }

  recipe(input?: string | string[], output?: string): void {
    super.init(input, output);

    BalmJS.logger.info('input:', this.input);
    console.log('sass task');
    BalmJS.logger.info('output:', this.output);
  }

  fn = (cb: Function): void => {
    this.recipe();
    cb();
  };
}

export = SassTask;
