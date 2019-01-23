const PRIVATE_TASKS = require('require-dir')('../tasks/private');
const PUBLIC_TASKS = require('require-dir')('../tasks/public');

function* taskEntries(obj1, obj2) {
  let obj = Object.assign({}, obj1, obj2);
  for (let key of Object.keys(obj)) {
    yield obj[key].default;
  }
}

const registerTasks = () => {
  let balmTasks = [];
  let balmStack = [];

  for (let GulpTask of taskEntries(PRIVATE_TASKS, PUBLIC_TASKS)) {
    let gulpTask = new GulpTask();

    if (gulpTask.deps) {
      balmStack.push(gulpTask);
    } else {
      balmTasks.push(gulpTask);
    }

    BalmJS.tasks.push(GulpTask);
  }

  // The more dependencies, the more behind (except `cache` and `default` task)
  balmStack = balmStack.sort((a, b) => a.deps.length - b.deps.length);
  let cacheTask = balmStack.filter(gulpTask => gulpTask.name === 'cache');
  let filterTasks = balmStack.filter(gulpTask => gulpTask.name !== 'cache');
  balmTasks = balmTasks.concat(filterTasks, cacheTask);

  // Register balm tasks
  balmTasks.forEach(gulpTask => {
    let taskName = toNamespace(gulpTask.name);

    let balmTask =
      gulpTask.name === 'sprites' && config.sprites.image.length
        ? series(toNamespace(gulpTask.deps))
        : gulpTask.fn;

    task(taskName, balmTask);
  });
};

export default registerTasks;
