class EndTask extends BalmJS.BalmTask {
  constructor() {
    super('end');
  }

  fn = async (callback: Function): Promise<any> => {
    if (BalmJS.utils.isFunction(BalmJS.afterTask)) {
      await (BalmJS.afterTask as Function)();
    }

    console.timeEnd(BalmJS.TIME_FLAG);

    callback();
  };
}

export default EndTask;
