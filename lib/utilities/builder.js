class Builder {
  static generate(
    name,
    { input = '', output = '', options = {}, tail = undefined }
  ) {
    BalmJS.recipeIndex += 1;

    let CustomTask = BalmJS.tasks.find(task => task.name === name);
    let task = new CustomTask(input, output, options, tail);
    let taskName = `${task.name}:${BalmJS.recipeIndex}`;

    // Register custom task
    let customBalmTask =
      name === 'Server' ? series(getNamespace(['html']), task.fn) : task.fn;
    task(taskName, customBalmTask);

    BalmJS.recipes.push(taskName);
  }
}

export default Builder;
