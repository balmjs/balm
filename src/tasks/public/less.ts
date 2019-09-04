class LessTask extends BalmJS.BalmTask {
  constructor() {
    super('less');
  }

  fn(cb: Function): void {
    console.log('less task');
    cb();
  }
}

export = LessTask;
