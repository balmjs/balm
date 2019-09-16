class Maker {
  // Register custom task
  static generate(name: string, args: any): void {
    const customTask = BalmJS.tasks.find((task: any) => task.name === name);
    // console.log('customTask', customTask); // NOTE: debug

    const taskName = `${customTask.name}:${BalmJS.recipeIndex}`;
    let taskFunction: Function = function(cb: Function): void {
      cb();
    };

    switch (customTask.name) {
      case 'script':
        taskFunction = function(cb: Function): void {
          args.unshift(cb);
          customTask.recipe(...args);
        };
        break;
      default:
        taskFunction = function(cb: Function): void {
          customTask.recipe(...args);
          cb();
        };
    }

    gulp.task(BalmJS.toNamespace(taskName), taskFunction);

    BalmJS.recipes.push(taskName);
    BalmJS.recipeIndex++;
  }
}

export default Maker;
