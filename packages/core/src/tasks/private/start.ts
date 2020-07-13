class StartTask extends BalmJS.BalmTask {
  constructor() {
    super('start');
  }

  fn = async (callback: Function): Promise<any> => {
    console.time(BalmJS.TIME_FLAG);

    if (BalmJS.utils.isFunction(BalmJS.beforeTask)) {
      await (BalmJS.beforeTask as Function)();
    }

    callback();
  };
}

export default StartTask;
