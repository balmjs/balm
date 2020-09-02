class DefaultTask extends BalmJS.BalmTask {
  constructor() {
    super('default');
  }

  get startTask(): string[] {
    const tasks = BalmJS.toNamespace(['start']) as string[];

    if (BalmJS.utils.isString(BalmJS.beforeTask)) {
      tasks.unshift(BalmJS.beforeTask as string);
    }

    return tasks;
  }

  get mainTasks(): string[] {
    let tasks: string[] = [
      'clean',
      // Stylesheets
      ...(BalmJS.config.styles.sprites.length ? ['sprite'] : []),
      'style',
      // Scripts
      ...(BalmJS.config.scripts.lint ? ['lint'] : []),
      'script',
      // Templates
      'html',
      // Other Assets
      ...(BalmJS.config.env.isProd || !BalmJS.config.inFrontend
        ? ['image', 'font', 'media']
        : [])
    ];

    if (BalmJS.config.env.isProd) {
      tasks = [
        ...tasks,
        'extra',
        'build', // Measure size
        ...(BalmJS.config.assets.cache ? ['cache'] : []),
        ...(BalmJS.config.pwa.enabled ? ['workbox-sw', 'pwa'] : [])
      ];
    } else {
      tasks = [...tasks, 'modernizr', 'serve'];
    }

    let defaultMainTasks = BalmJS.config.useDefaults
      ? (BalmJS.toNamespace(tasks) as string[])
      : [];

    if (BalmJS.config.env.inSSR || BalmJS.config.env.isMP) {
      defaultMainTasks = BalmJS.toNamespace(
        BalmJS.config.env.isMP ? ['style', 'script'] : ['script']
      ) as string[];
    }

    return defaultMainTasks;
  }

  get subTasks(): string[] {
    return BalmJS.recipes.length
      ? (BalmJS.toNamespace(BalmJS.recipes) as string[])
      : [];
  }

  get endTask(): string[] {
    const tasks = BalmJS.toNamespace(['end']) as string[];

    if (BalmJS.utils.isString(BalmJS.afterTask)) {
      tasks.push(BalmJS.afterTask as string);
    }

    return tasks;
  }
}

export default DefaultTask;
