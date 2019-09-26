const BLACKLIST_IN_PROD = ['serve', 'watch'];
const BLACKLIST_IN_DEV = [
  'publish',
  ...(BalmJS.config.useDefaults ? BLACKLIST_IN_PROD : [])
];

function ban(name: string): boolean {
  const banInProd =
    BalmJS.config.env.isProd && BLACKLIST_IN_PROD.includes(name);
  const banInDev = BalmJS.config.env.isDev && BLACKLIST_IN_DEV.includes(name);
  const isBan = banInProd || banInDev;

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
    let message =
      BalmJS.config.useDefaults &&
      BalmJS.config.env.isDev &&
      BLACKLIST_IN_PROD.includes(name)
        ? `'mix.${api}()' can only be used for 'balm.config.useDefaults = false'`
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
      case 'sprite':
        if (BalmJS.config.styles.sprites.length) {
          balmTask = gulp.series(BalmJS.toNamespace(customTask.deps));
        }
        break;
      case 'script':
      case 'remove':
        balmTask = function(cb: Function): void {
          args.unshift(cb);
          customTask.recipe(...args);
        };
        break;
      case 'modernizr':
      case 'html':
      case 'serve':
        balmTask = function(cb: Function): void {
          customTask.fn();
          cb();
        };
        break;
      default:
        balmTask = function(cb: Function): void {
          customTask.recipe(...args);
          cb();
        };
    }

    if (BalmJS.watching) {
      gulp.parallel(balmTask)();
    } else {
      gulp.task(BalmJS.toNamespace(taskName), balmTask);

      BalmJS.recipes.push(taskName);
      BalmJS.recipeIndex++;
    }
  }
}

export default Maker;
