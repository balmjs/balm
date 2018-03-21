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
    if (name === 'Server') {
      gulp.task(taskName, getNamespace(['html']), task.fn);
    } else {
      gulp.task(taskName, task.fn);
    }

    BalmJS.recipes.push(taskName);
  }
}

export default Builder;
