class StartTask extends BalmJS.BalmTask {
  constructor() {
    super('start');
  }

  fn(cb: Function): void {
    if (!BalmJS.config.env.isTest) {
      console.time(BalmJS.TIME_FLAG);
    }

    if (BalmJS.utils.isFunction(BalmJS.beforeTask)) {
      BalmJS.beforeTask();
    }

    cb();
  }
}

export = StartTask;
