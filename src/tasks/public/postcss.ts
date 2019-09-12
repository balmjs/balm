class PostcssTask extends BalmJS.BalmStyleTask {
  constructor() {
    super('postcss');
  }

  recipe(input?: string | string[], output?: string): void {
    this.init(input, output);

    this.handleStyle(this.name, this.output);
  }

  fn = (cb: Function): void => {
    this.recipe();
    cb();
  };
}

export = PostcssTask;