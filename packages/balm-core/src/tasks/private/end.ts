class EndTask extends BalmJS.BalmTask {
  constructor() {
    super('end');
  }

  time(): void {
    const end = process.hrtime(BalmJS.start);
    const timeInMs = Math.ceil((end[0] * 1000000000 + end[1]) / 1000000);

    BalmJS.logger.info('execution time', `${timeInMs}ms`, {
      logLevel: BalmJS.LogLevel.Error
    });
  }

  fn = async (callback: Function): Promise<void> => {
    if (BalmJS.utils.isFunction(BalmJS.afterTask)) {
      await (BalmJS.afterTask as Function)();
    }

    this.time();

    BalmJS.emitter.emit('exit');

    callback();
  };
}

export default EndTask;
