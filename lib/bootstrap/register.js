import { toNamespace } from '../utilities';
const TASKS = require('require-dir')('../tasks/private');

function* taskEntries(obj) {
  for (let key of Object.keys(obj)) {
    yield obj[key].default;
  }
}

const LAST_TASKS = ['cache', 'default'];
const DEPS_TASKS = ['sprites', 'default'];

const registerTasks = () => {
  let balmTasks = [];
  let balmStack = [];

  for (let GulpTask of taskEntries(TASKS)) {
    let gulpTask = new GulpTask();

    if (gulpTask.deps) {
      balmStack.push(gulpTask);
    } else {
      balmTasks.push(gulpTask);
    }

    BalmJS.tasks.push(gulpTask);
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

    let balmTask = DEPS_TASKS.includes(gulpTask.name)
      ? series(toNamespace(gulpTask.deps))
      : gulpTask.fn;

    task(taskName, balmTask);
  });

  if (BalmJS.taskNames.size) {
    logger.info('[Gulp tasks]', BalmJS.taskNames.values());
  }
};

export default registerTasks;
