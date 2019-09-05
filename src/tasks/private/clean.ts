class CleanTask extends BalmJS.BalmTask {
  constructor() {
    super('clean');
  }

  fn(cb: Function): void {
    console.log('clean task');
    cb();
  }
}

export = CleanTask;
