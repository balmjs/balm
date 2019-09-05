class LessTask extends BalmJS.StyleTask {
  constructor() {
    super('less');
  }

  fn(cb: Function): void {
    console.log('less task');
    cb();
  }
}

export = LessTask;
