class BalmBuilder {
  static generate(name, args) {
    BalmJS.recipeIndex += 1;

    let CustomTask = BalmJS.tasks.find(task => task.name === `${name}Task`);
    let customTask = new CustomTask(...args);
    let taskName = `${customTask.name}:${BalmJS.recipeIndex}`;

    // Register custom task
    let balmTask =
      name === 'Server'
        ? series(toNamespace(customTask.deps), customTask.fn)
        : customTask.fn;
    task(toNamespace(taskName), balmTask);

    BalmJS.recipes.push(taskName);
  }
}

export default BalmBuilder;
