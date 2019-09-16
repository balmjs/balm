class EndTask extends BalmJS.BalmTask {
  constructor() {
    super('end');
  }

  fn(): void {
    if (BalmJS.utils.isFunction(BalmJS.afterTask)) {
      BalmJS.afterTask();
    }

    if (!BalmJS.config.env.isTest) {
      console.timeEnd(BalmJS.TIME_FLAG);
    }
  }
}

export = EndTask;
