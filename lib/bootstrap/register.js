const PRIVATE_TASKS = require('require-dir')('../tasks/private');
const PUBLIC_TASKS = require('require-dir')('../tasks/public');
const NEXT_TASKS = require('require-dir')('../tasks/next');

function* taskEntries(privateTasks, publicTasks, nextTasks) {
  let obj = Object.assign({}, privateTasks, publicTasks, nextTasks);
  for (let key of Object.keys(obj)) {
    yield obj[key].default;
  }
}

const registerTasks = () => {
  let depsTasks = [];
  let nonDepsTasks = [];

  for (let GulpTask of taskEntries(
    ...[PRIVATE_TASKS, PUBLIC_TASKS, NEXT_TASKS]
  )) {
    let gulpTask = new GulpTask();

    if (gulpTask.deps) {
      depsTasks.push(gulpTask);
    } else {
      nonDepsTasks.push(gulpTask);
    }

    BalmJS.tasks.push(GulpTask);
  }

  // The more dependencies, the more behind (except `cache` and `default` task)
  let ascDepsTasks = depsTasks.sort((a, b) => a.deps.length - b.deps.length);
  let cacheTask = ascDepsTasks.filter(gulpTask => gulpTask.name === 'cache');
  let nonCacheTasks = ascDepsTasks.filter(
    gulpTask => gulpTask.name !== 'cache'
  );
  const balmTasks = [...nonDepsTasks, ...nonCacheTasks, ...cacheTask];

  // Register balm tasks
  const balmTasksCount = balmTasks.length;
  for (let i = 0; i < balmTasksCount; i++) {
    let gulpTask = balmTasks[i];
    let taskName = toNamespace(gulpTask.name);
    let balmTask =
      gulpTask.name === 'sprites' && config.sprites.image.length
        ? series(toNamespace(gulpTask.deps))
        : gulpTask.fn;

    task(taskName, balmTask);
  }
};

export default registerTasks;
