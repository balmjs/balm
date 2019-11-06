const BLACKLIST_IN_PROD = ['serve'];

function ban(name: string): boolean {
  const BLACKLIST_IN_DEV = [
    'publish',
    ...(BalmJS.config.useDefaults ? BLACKLIST_IN_PROD : [])
  ];

  const banInProd: boolean =
    BalmJS.config.env.isProd && BLACKLIST_IN_PROD.includes(name);
  const banInDev: boolean =
    BalmJS.config.env.isDev && BLACKLIST_IN_DEV.includes(name);
  const isBan: boolean = banInProd || banInDev;

  let api: string;
  switch (name) {
    case 'postcss':
      api = 'css';
      break;
    case 'script':
      api = 'js';
      break;
    default:
      api = name;
  }

  if (isBan) {
    const message: string =
      BalmJS.config.useDefaults &&
      BalmJS.config.env.isDev &&
      BLACKLIST_IN_PROD.includes(name)
        ? `'mix.${api}()' can only be used for 'balm.config.useDefaults = false;'`
        : `There is no 'mix.${api}()' hook in ${
            banInProd ? 'production' : 'development'
          } mode`;

    BalmJS.logger.warn('balm hook', message);
  }

  return isBan;
}

class Maker {
  // Register custom task
  static generate(name: string, args: any = []): void {
    if (ban(name)) {
      return;
    }

    const customTask = BalmJS.tasks.find((task: any) => task.name === name);
    const taskName = ['sprite', ...BLACKLIST_IN_PROD].includes(customTask.name)
      ? customTask.name
      : `${customTask.name}:${BalmJS.recipeIndex}`;
    let balmTask: Function = function(cb: Function): void {
      cb();
    }; // NOTE: `balmTask` function name for `gulp.parallel`

    switch (customTask.name) {
      // private
      case 'sprite':
        if (customTask.deps.length) {
          balmTask = gulp.series(BalmJS.toNamespace(customTask.deps));
        } else {
          BalmJS.logger.warn(
            'balm hook',
            'mix.sprite() needs to setup `balm.config.styles.sprites`'
          );
        }
        break;
      case 'modernizr':
        balmTask = customTask.fn;
        break;
      // public
      default:
        balmTask = customTask.recipe(...args);
    }

    if (BalmJS.watching) {
      gulp.parallel(balmTask)();
    } else {
      gulp.task(BalmJS.toNamespace(taskName) as string, balmTask);

      BalmJS.recipes.push(taskName);
      BalmJS.recipeIndex++;
    }
  }
}

export default Maker;
