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

  mainTasks(): string[] {
    const tasks: string[] = ['clean', 'sass'];

    // if (BalmJS.config.inFrontend) {
    //   tasks.push('wiredep');
    // }

    // if (BalmJS.config.images.sprites.length) {
    //   tasks.push('sprites');
    // }

    // if (BalmJS.config.scripts.eslint) {
    //   tasks.push('lint');
    // }

    tasks.push('less');

    return BalmJS.config.useDefaults ? tasks : [];
  }

  subTasks(): string[] {
    return BalmJS.recipes.length ? BalmJS.recipes : [];
  }

  get deps(): string[] {
    const tasks = ['start', ...this.mainTasks(), ...this.subTasks(), 'end'];

    return tasks;
  }
}

export default DefaultTask;
