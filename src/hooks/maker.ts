class Maker {
  static generate(name: string, args: any): void {
    BalmJS.recipeIndex += 1;

    const customTask = BalmJS.mixins.find((task: any) => task.name === name);
    // let customTask = args ? new CustomTask(...args) : new CustomTask();
    const taskName = `${customTask.name}:${BalmJS.recipeIndex}`;
    const taskFn = customTask.recipe;

    // Register custom task
    // let balmTask =
    //   name === 'Server'
    //     ? gulp.series(BalmJS.toNamespace(customTask.deps), customTask.fn)
    //     : customTask.fn;
    gulp.task(BalmJS.toNamespace(taskName), function(cb: Function) {
      taskFn(...args);
      cb();
    });

    BalmJS.recipes.push(taskName);
  }
}

export default Maker;
