class SassTask extends BalmJS.StyleTask {
  constructor() {
    super('sass');
  }

  recipe(input: string, output: string): void {
    BalmJS.logger.info('input', input);
    super.show('sass');
    BalmJS.logger.info('output', output);
  }

  fn(cb: Function): void {
    super.show('sass');
    cb();
  }
}

export = SassTask;
