class EndTask extends BalmJS.BalmTask {
  constructor() {
    super('end');
  }

  fn(cb: Function): void {
    if (BalmJS.utils.isFunction(BalmJS.afterTask)) {
      BalmJS.afterTask();
    }

    if (!BalmJS.config.isTest) {
      console.timeEnd(BalmJS.TIME_FLAG);
    }

    cb();
  }
}

export = EndTask;
