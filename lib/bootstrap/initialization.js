import {ASSETS} from '../config/constants';

/**
 * Balm initialization
 */
const init = () => {
  // Create local quick dir
  for (let rootKey of Object.keys(config.roots)) {
    let rootValue = config.roots[rootKey];
    config[rootKey] = {};
    for (let pathKey of Object.keys(config.paths[rootKey])) {
      let pathValue = config.paths[rootKey][pathKey];
      config[rootKey][pathKey] = (rootKey === 'target' && ASSETS.includes(pathKey))
        ? path.join(config.workspace, rootValue, config.assets.subDir, pathValue)
        : path.join(config.workspace, rootValue, pathValue);
    }
  }
  config.target.static = path.join(config.target.base, config.assets.subDir);

  // Create remote quick dir
  config.assets.static = path.join(config.assets.root, config.assets.publicPath, config.assets.subDir);
  for (let assetKey of ASSETS) {
    config.assets[assetKey] = path.join(config.assets.static, config.paths.target[assetKey]);
  }

  // Set default js
  if (!Object.keys(config.scripts.entry).length) {
    config.scripts.entry.main = `./${config.roots.source}/${config.paths.source.js}/main.js`;
  }

  // Set default loader
  require('./loaders');

  // Register task
  require('./tasks');

  logger.success('Balm configuration', config);
};

const run = taskName => {
  if (BalmJS.taskNames.includes(taskName)) {
    logger.info('Run gulp task', taskName);
    gulp.start(taskName);
  } else {
    logger.warning('Invalid task', taskName);
  }
};

export {init, run};
