class EndTask extends BalmJS.BalmTask {
  constructor() {
    super('end');
  }

  fn(cb: Function): void {
    if (BalmJS.utils.isFunction(BalmJS.afterTask)) {
      BalmJS.afterTask();
    }

    console.timeEnd(BalmJS.TIME_FLAG);

    cb();
  }
}

export default EndTask;
