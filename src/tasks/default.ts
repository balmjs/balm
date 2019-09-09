class DefaultTask extends BalmJS.BalmTask {
  constructor() {
    super('default');
  }

  get startTask(): string[] {
    const tasks = ['start'];

    if (BalmJS.utils.isString(BalmJS.beforeTask)) {
      tasks.unshift(BalmJS.beforeTask);
    }

    return BalmJS.toNamespace(tasks) as string[];
  }

  get mainTasks(): string[] {
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
    const tasks = ['end'];

    if (BalmJS.utils.isString(BalmJS.afterTask)) {
      BalmJS.tasks.push(BalmJS.afterTask);
    }

    return BalmJS.toNamespace(tasks) as string[];
  }
}

export default DefaultTask;
