class EndTask extends BalmJS.BalmTask {
  constructor() {
    super('end');
  }

  time(): void {
    const end = process.hrtime(BalmJS.start);
    const timeInMs = (end[0] * 1000000000 + end[1]) / 1000000;

    BalmJS.logger.info('execution time', `${timeInMs}ms`, {
      logLevel: BalmJS.LogLevel.Error
    });
  }

  fn = async (callback: Function): Promise<any> => {
    if (BalmJS.utils.isFunction(BalmJS.afterTask)) {
      await (BalmJS.afterTask as Function)();
    }

    this.time();

    callback();
  };
}

export default EndTask;
