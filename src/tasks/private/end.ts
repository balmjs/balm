class EndTask extends BalmJS.BalmTask {
  constructor() {
    super('end');
  }

  fn(cb: Function): void {
    if (BalmJS.utils.isFunction(BalmJS.afterTask)) {
      (BalmJS.afterTask as Function)();
    }

    console.timeEnd(BalmJS.TIME_FLAG);

    cb();
  }
}

export default EndTask;
