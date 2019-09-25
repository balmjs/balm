class Maker {
  // Register custom task
  static generate(name: string, args: any = []): void {
    const customTask = BalmJS.tasks.find((task: any) => task.name === name);
    const taskName =
      customTask.name === 'watch'
        ? customTask.name
        : `${customTask.name}:${BalmJS.recipeIndex}`;
    let balmTask: Function = function(cb: Function): void {
      cb();
    }; // NOTE: `balmTask` function name for `gulp.parallel`

    switch (customTask.name) {
      case 'script':
      case 'remove':
        balmTask = function(cb: Function): void {
          args.unshift(cb);
          customTask.recipe(...args);
        };
        break;
      case 'url':
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
