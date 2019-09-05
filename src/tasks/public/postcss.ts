class PostcssTask extends BalmJS.StyleTask {
  constructor() {
    super('postcss');
  }

  fn(cb: Function): void {
    console.log('postcss task');
    cb();
  }
}

export = PostcssTask;
