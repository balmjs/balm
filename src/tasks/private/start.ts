class StartTask extends BalmJS.BalmTask {
  constructor() {
    super('start');
  }

  fn(): void {
    if (!BalmJS.config.env.isTest) {
      console.time(BalmJS.TIME_FLAG);
    }

    if (BalmJS.utils.isFunction(BalmJS.beforeTask)) {
      BalmJS.beforeTask();
    }
  }
}

export default StartTask;
