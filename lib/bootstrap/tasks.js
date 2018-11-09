const TASKS = require('require-dir')('../tasks');

function* taskEntries(obj) {
  for (let key of Object.keys(obj)) {
    yield obj[key].default;
  }
}

const getTasks = () => {
  for (let GulpTask of taskEntries(TASKS)) {
    let task = new GulpTask();

    // Register default task
    task(task.name, task.fn);

    BalmJS.tasks.push(GulpTask);
    BalmJS.taskNames.add(task.name);
  }

  if (BalmJS.taskNames.size) {
    logger.info('[Gulp tasks]', BalmJS.taskNames.values());
  }
};

export default getTasks;
