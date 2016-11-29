const ASSETS = ['css', 'js', 'img', 'font'];

/**
 * Balm initialization
 */
const init = () => {
  // create quick dir
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

  // create assets dir
  config.target.static = path.join(config.target.base, config.assets.subDir);
  config.assets.static = path.join(config.assets.root, config.assets.publicPath, config.assets.subDir);
  for (let asset of ASSETS) {
    config.assets[asset] = path.join(config.assets.static, config.paths.target[asset]);
  }

  // set default js
  if (!Object.keys(config.scripts.entry).length) {
    config.scripts.entry.main = config.source.js + '/main.js';
  }

  // set loader js
  require('./loaders');

  // register task
  require('./tasks');

  logger.success('Balm configuration', config);
};

/**
 * Balm recipe
 */
const ready = () => {
  let customTaskIndex = 1;

  for (let collection of BalmJS.collections) {
    let customTaskName = collection.task.name + '-' + customTaskIndex;

    gulp.task(customTaskName, () => {
      return collection.tail
        ? collection.task.fn(collection.input, collection.output, collection.tail)
        : collection.task.fn(collection.input, collection.output);
    });

    BalmJS.recipes.push(customTaskName);
    customTaskIndex++;
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
