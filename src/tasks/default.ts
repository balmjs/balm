class DefaultTask extends BalmJS.BalmTask {
  constructor() {
    super('default');
  }

  get startTask(): string[] {
    const tasks = BalmJS.toNamespace(['start']) as string[];

    if (BalmJS.utils.isString(BalmJS.beforeTask)) {
      tasks.unshift(BalmJS.beforeTask);
    }

    return tasks;
  }

  get mainTasks(): string[] {
    const tasks: string[] = [
      'clean',
      ...(BalmJS.config.inFrontend ? ['wiredep'] : []),
      ...(BalmJS.config.images.sprites.length ? ['sprites'] : []),
      ...(BalmJS.config.scripts.eslint ? ['lint'] : [])
    ];

    return BalmJS.config.useDefaults
      ? (BalmJS.toNamespace(tasks) as string[])
      : [];
  }

  get subTasks(): string[] {
    return BalmJS.recipes.length
      ? (BalmJS.toNamespace(BalmJS.recipes) as string[])
      : [];
  }

  get endTask(): string[] {
    const tasks = BalmJS.toNamespace(['end']) as string[];

    if (BalmJS.utils.isString(BalmJS.afterTask)) {
      tasks.push(BalmJS.afterTask);
    }

    return tasks;
  }

  fn(cb: Function): void {
    cb();
  }
}

export default DefaultTask;
