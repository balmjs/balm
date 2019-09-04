class PostcssTask extends BalmJS.BalmTask {
  constructor() {
    super('postcss');
  }

  fn(cb: Function): void {
    console.log('postcss task');
    cb();
  }
}

export = PostcssTask;
