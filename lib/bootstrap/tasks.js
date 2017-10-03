const TASKS = require('require-dir')('../tasks');

function * taskEntries(obj) {
  for (let key of Object.keys(obj)) {
    let GulpTask = obj[key].default;
    yield GulpTask;
  }
}

for (let GulpTask of taskEntries(TASKS)) {
  let task = new GulpTask();
  let taskName = task.name;

  // Register default task
  gulp.task(taskName, task.deps, task.fn);

  BalmJS.tasks.push(GulpTask);
  BalmJS.taskNames.push(taskName);
}

logger.info('Gulp tasks', BalmJS.tasks);
