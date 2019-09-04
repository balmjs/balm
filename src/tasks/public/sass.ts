class SassTask extends BalmJS.BalmTask {
  constructor() {
    super('sass');
  }

  fn(cb: Function): void {
    console.log('sass task');
    cb();
  }
}

export = SassTask;
