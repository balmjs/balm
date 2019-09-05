class SassTask extends BalmJS.StyleTask {
  constructor() {
    super('sass');
  }

  fn(cb: Function): void {
    console.log('sass task');
    cb();
  }
}

export = SassTask;
