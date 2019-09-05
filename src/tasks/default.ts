class DefaultTask extends BalmJS.BalmTask {
  constructor() {
    super('default');

    BalmJS.tasks = BalmJS.toNamespace(this.deps) as string[];

    if (BalmJS.utils.isString(BalmJS.beforeTask)) {
      BalmJS.tasks.unshift(BalmJS.beforeTask);
    }

    if (BalmJS.utils.isString(BalmJS.afterTask)) {
      BalmJS.tasks.push(BalmJS.afterTask);
    }

    if (BalmJS.config.logs.level === BalmJS.LogLevel.Debug) {
      BalmJS.logger.debug(BalmJS.tasks, true);
    }
  }

  get deps(): string[] {
    let tasks = ['start', 'end'];

    return BalmJS.config.inSSR ? ['scripts'] : tasks;
  }
}

export default DefaultTask;
