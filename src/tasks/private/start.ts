class StartTask extends BalmJS.BalmTask {
  constructor() {
    super('start');
  }

  fn(cb: Function): void {
    console.time(BalmJS.TIME_FLAG);

    if (BalmJS.utils.isFunction(BalmJS.beforeTask)) {
      (BalmJS.beforeTask as Function)();
    }

    cb();
  }
}

export default StartTask;
