class Builder {
  static generate(
    name,
    { input = '', output = '', options = {}, tail = undefined }
  ) {
    BalmJS.recipeIndex += 1;

    let CustomTask = BalmJS.tasks.find(task => task.name === name);
    let customTask = new CustomTask(input, output, options, tail);
    let taskName = `${customTask.name}:${BalmJS.recipeIndex}`;

    // Register custom task
    let balmTask =
      name === 'Server'
        ? series(toNamespace(['html']), customTask.fn)
        : customTask.fn;
    task(taskName, balmTask);

    BalmJS.recipes.push(taskName);
  }
}

export default Builder;
