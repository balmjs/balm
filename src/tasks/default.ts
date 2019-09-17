class DefaultTask extends BalmJS.BalmTask {
  constructor() {
    super('default');
  }

  get styleName(): string {
    let name: string;

    switch (BalmJS.config.styles.extname) {
      case 'sass':
      case 'scss':
        name = 'sass';
        break;
      case 'less':
        name = 'less';
        break;
      default:
        name = 'postcss';
    }

    return name;
  }

  get startTask(): string[] {
    const tasks = BalmJS.toNamespace(['start']) as string[];

    if (BalmJS.utils.isString(BalmJS.beforeTask)) {
      tasks.unshift(BalmJS.beforeTask);
    }

    return tasks;
  }

  get mainTasks(): string[] {
    let tasks: string[] = [
      'clean',
      ...(BalmJS.config.styles.sprites.length ? ['sprite'] : [])
    ];

    if (BalmJS.config.env.isProd) {
      tasks = [
        ...tasks,
        ...(BalmJS.config.scripts.eslint ? ['lint'] : []),
        this.styleName,
        'url',
        'script'
        // 'modernizr'
        // 'html'
        // 'image',
        // 'font',
        // 'extra',
        // 'measureSize'
        // ...(BalmJS.config.assets.cache ? ['cache'] : []),
        // ...(BalmJS.config.pwa.enabled ? ['pwa'] : [])
      ];
    } else {
      tasks = [
        ...tasks,
        this.styleName,
        'url',
        'script',
        // 'modernizr',
        // 'font',
        // ...(BalmJS.config.pwa.enabled ? ['pwa'] : [])
        'serve'
      ];
    }

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
