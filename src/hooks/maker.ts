class Maker {
  static generate(name: string, args: any): void {
    BalmJS.recipeIndex++;

    const customTask = BalmJS.mixins.find((task: any) => task.name === name);
    // console.log('customTask', customTask); // NOTE: debug

    // Register custom task
    const taskName = `${customTask.name}:${BalmJS.recipeIndex}`;
    const taskFn = function(cb: Function): void {
      customTask.recipe(...args);
      cb();
    };
    gulp.task(BalmJS.toNamespace(taskName), taskFn);

    BalmJS.recipes.push(taskName);
  }
}

export default Maker;
