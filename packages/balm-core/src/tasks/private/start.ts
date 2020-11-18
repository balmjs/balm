class StartTask extends BalmJS.BalmTask {
  constructor() {
    super('start');
  }

  fn = async (callback: Function): Promise<void> => {
    BalmJS.start = process.hrtime();

    if (BalmJS.utils.isFunction(BalmJS.beforeTask)) {
      await (BalmJS.beforeTask as Function)();
    }

    callback();
  };
}

export default StartTask;
