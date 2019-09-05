class PostcssTask extends BalmJS.StyleTask {
  constructor() {
    super('postcss');
  }

  recipe(input?: string, output?: string): void {
    BalmJS.logger.info('input', input as string);
    super.show('postcss');
    BalmJS.logger.info('output', output as string);
  }

  fn(cb: Function): void {
    super.show('postcss');
    cb();
  }
}

export = PostcssTask;
