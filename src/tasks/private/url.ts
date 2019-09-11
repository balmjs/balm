class UrlTask extends BalmJS.BalmTask {
  constructor() {
    super('url');
  }

  fn(cb: Function): void {
    console.log('url task');
    cb();
  }
}

export = UrlTask;
