const ASSETS = ['css', 'js', 'img', 'font'];
const END = 'end';

/**
 * Balm initialization
 */
const init = () => {
  // Create quick dir
  for (let rootKey of Object.keys(config.roots)) {
    let rootValue = config.roots[rootKey];
    config[rootKey] = {};
    for (let pathKey of Object.keys(config.paths[rootKey])) {
      let pathValue = config.paths[rootKey][pathKey];
      config[rootKey][pathKey] = (rootKey === 'target' && ASSETS.indexOf(pathKey) > -1)
        ? path.join(config.workspace, rootValue, config.assets.subDir, pathValue)
        : path.join(config.workspace, rootValue, pathValue);
    }
  }

  // Create assets dir
  config.target.static = path.join(config.target.base, config.assets.subDir);
  config.assets.static = path.join(config.assets.root, config.assets.publicPath, config.assets.subDir);
  for (let asset of ASSETS) {
    config.assets[asset] = path.join(config.assets.static, config.paths.target[asset]);
  }

  // Set default js
  if (!Object.keys(config.scripts.entry).length) {
    config.scripts.entry.main = `./${config.roots.source}/${config.paths.source.js}/main.js`;
  }

  // Set loader js
  require('./loaders');

  // Register task
  require('./tasks');

  logger.success('Balm configuration', config);
};

/**
 * Balm recipe
 */
const ready = () => {
  let customTaskIndex = 1;
  let endCollection = false;

  for (let collection of BalmJS.collections) {
    if (collection.task.name === END) {
      endCollection = collection;
    } else {
      let customTaskName = `${collection.task.name}-${customTaskIndex}`;

      gulp.task(customTaskName, () => {
        return collection.tail
          ? collection.task.fn(collection.input, collection.output, collection.tail)
          : collection.task.fn(collection.input, collection.output);
      });

      BalmJS.recipes.push(customTaskName);
      customTaskIndex += 1;
    }
  }

  if (endCollection) {
    gulp.task(END, () => {
      return endCollection.task.fn(endCollection.input);
    });
    BalmJS.recipes.push(END);
  }
};

const run = taskName => {
  if (BalmJS.tasks.indexOf(taskName) === -1) {
    logger.warning('Invalid task', taskName);
  } else {
    logger.info('Run gulp task', taskName);
    gulp.start(taskName);
  }
};

export {init, ready, run};
