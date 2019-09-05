class LessTask extends BalmJS.StyleTask {
  constructor() {
    super('less');
  }

  recipe(input?: string, output?: string): void {
    BalmJS.logger.info('input', input as string);
    super.show('less');
    BalmJS.logger.info('output', output as string);
  }

  fn(cb: Function): void {
    super.show('less');
    cb();
  }
}

export = LessTask;
