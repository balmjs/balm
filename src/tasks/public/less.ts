class LessTask extends BalmJS.StyleTask {
  constructor() {
    super('less');
  }

  recipe = (input?: string, output?: string): void => {
    console.log(input, output);
    this.input = input || 'default input';
    this.output = output || 'default output';

    BalmJS.logger.info('input:', this.input);
    super.show('less');
    BalmJS.logger.info('output:', this.output);
  };

  fn = (cb: Function): void => {
    this.recipe();
    cb();
  };
}

export = LessTask;
