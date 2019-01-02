import { toNamespace } from '../utilities';
const TASKS = require('require-dir')('../tasks');

function* taskEntries(obj) {
  for (let key of Object.keys(obj)) {
    yield obj[key].default;
  }
}

const LAST_TASKS = ['cache', 'default'];

const registerTasks = () => {
  let balmTasks = [];
  let balmStack = [];

  for (let GulpTask of taskEntries(TASKS)) {
    let gulpTask = new GulpTask();

    if (gulpTask.deps.length) {
      balmStack.push(gulpTask);
    } else {
      balmTasks.push(gulpTask);
    }

    BalmJS.tasks.push(GulpTask);
    BalmJS.taskNames.add(gulpTask.name);
  }

  // The more dependencies, the more behind (except `cache` and `default` task)
  balmStack = balmStack.sort((a, b) => a.deps.length - b.deps.length);
  let cacheTask = balmStack.filter(gulpTask => gulpTask.name === 'cache');
  let defaultTask = balmStack.filter(gulpTask => gulpTask.name === 'default');
  let filterTasks = balmStack.filter(
    gulpTask => !LAST_TASKS.includes(gulpTask.name)
  );
  balmTasks = balmTasks.concat(filterTasks, cacheTask, defaultTask);

  // Register balm tasks
  balmTasks.forEach(gulpTask => {
    let taskName =
      gulpTask.name === 'default' ? gulpTask.name : toNamespace(gulpTask.name);

    let balmTask = gulpTask.deps.length
      ? gulpTask.fn
        ? series(toNamespace(gulpTask.deps), gulpTask.fn)
        : series(toNamespace(gulpTask.deps))
      : gulpTask.fn;

    task(taskName, balmTask);
  });

  if (BalmJS.taskNames.size) {
    logger.info('[Gulp tasks]', BalmJS.taskNames.values());
  }
};

export default registerTasks;
