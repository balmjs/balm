const TASKS = require('require-dir')('../tasks');

function* taskEntries(obj) {
  for (let key of Object.keys(obj)) {
    yield obj[key].default;
  }
}

for (let GulpTask of taskEntries(TASKS)) {
  let task = new GulpTask();
  let taskName = task.name === 'default' ? task.name : getNamespace(task.name);
  let taskDeps = getNamespace(task.deps);

  // Register default task
  gulp.task(taskName, taskDeps, task.fn);

  BalmJS.tasks.push(GulpTask);
  BalmJS.taskNames.add(taskName);
}

if (BalmJS.taskNames.size) {
  logger.info('[Gulp tasks]', BalmJS.taskNames.values());
}
