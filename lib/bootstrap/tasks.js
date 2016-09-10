const tasks = require('require-dir')('../task');

function* taskEntries(obj) {
  for (let key of Object.keys(obj)) {
    let SomeTask = obj[key].default;
    yield new SomeTask();
  }
}

for (let task of taskEntries(tasks)) {
  let taskName = task.name;
  let taskFn = task.fn;

  // collect custom task
  if (task.recipe) {
    taskFn = () => {
      return task.fn();
    };

    /**
     * Balm extension
     * @param  {string} input  relative path
     * @param  {string} output relative/absolute path
     */
    BalmJS.mixins[taskName] = (input, output, tail = undefined) => {
      let mixData = {
        task: task,
        input: input,
        output: output,
        tail: tail
      };
      BalmJS.collections.push(mixData);
    };
  }

  // register gulp task
  gulp.task(taskName, task.deps, taskFn);
  BalmJS.tasks.push(taskName);
}

BalmJS.log('Gulp tasks', BalmJS.tasks, 'primary');
