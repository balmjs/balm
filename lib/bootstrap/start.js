const customTask = (buildTask = '') => {
  BalmJS.log('Custom task', BalmJS.collections, 'info');

  let customTasks = [];
  let customTaskIndex = 0;
  for (let collection of BalmJS.collections) {
    let customTaskName = collection.task.name + '-' + customTaskIndex;
    gulp.task(customTaskName, () => {
      return collection.tail ?
        collection.task.fn(collection.input, collection.output, collection.tail) :
        collection.task.fn(collection.input, collection.output);
    });
    customTasks.push(customTaskName);
    customTaskIndex++;
  }

  if (customTasks.length) {
    let deps = buildTask ? [buildTask] : [];

    gulp.task('custom', deps, () => {
      require('run-sequence').apply(this, customTasks);
    });

    gulp.start('custom');
  } else {
    gulp.start(buildTask);
  }
};

const start = () => {
  let defaultTask = {
    name: 'default',
    deps: [],
    fn: () => {
      customTask();
    }
  };

  if (config.useDefault) {
    if (config.production) {
      defaultTask.deps = ['clean'];
      defaultTask.fn = () => {
        customTask(config.cache ? 'version' : 'build');
      };
    } else {
      let task = new BalmJS.Task();
      let beforeServeTasks = task.getSpriteTasks(true);
      if (beforeServeTasks.length) {
        defaultTask.deps = beforeServeTasks;
        defaultTask.fn = () => {
          customTask('serve');
        };
      } else {
        defaultTask.deps = ['serve'];
      }
    }
  }

  gulp.task(defaultTask.name, defaultTask.deps, defaultTask.fn);
};

export default start;
