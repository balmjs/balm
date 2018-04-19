import { ASSETS_KEYS } from '../config/constants';
import { isString, isArray, isFunction, mergeDeep } from '../utilities';

const setConfig = (customConfig = {}) => {
  let defaultConfig = config;

  // 0. Previously on config
  if (
    customConfig.scripts &&
    customConfig.scripts.entry &&
    !customConfig.scripts.vendors
  ) {
    for (let key of Object.keys(customConfig.scripts.entry)) {
      let value = customConfig.scripts.entry[key];
      if (isArray(value)) {
        defaultConfig.scripts.vendors.push({
          key,
          value
        });
      }
    }
  }

  // 1. Overwrite config
  let newConfig = mergeDeep(defaultConfig, customConfig);

  // 2. Copy `config.paths.target` to `config.paths.tmp`
  config = mergeDeep(newConfig, {
    paths: {
      tmp: config.paths.target
    }
  });
  config.paths.tmp.font = config.paths.source.font; // Fix for dev

  // 3. For the dynamic project
  if (!config.static) {
    config.roots.tmp = config.roots.target;
  }
};

const ready = () => {
  // Create local quick directories
  for (let rootKey of Object.keys(config.roots)) {
    let rootValue = config.roots[rootKey];
    config[rootKey] = {};
    for (let pathKey of Object.keys(config.paths[rootKey])) {
      let pathValue = config.paths[rootKey][pathKey];
      config[rootKey][pathKey] =
        rootKey === 'target' && ASSETS_KEYS.includes(pathKey)
          ? path.join(
              config.workspace,
              rootValue,
              config.assets.subDir,
              pathValue
            )
          : path.join(config.workspace, rootValue, pathValue);
    }
  }
  config.target.static = path.join(config.target.base, config.assets.subDir);

  // Create remote quick directories
  config.assets.static = path.join(
    config.assets.root,
    config.assets.publicPath,
    config.assets.subDir
  );
  for (let assetKey of ASSETS_KEYS) {
    config.assets[assetKey] = path.join(
      config.assets.static,
      config.paths.target[assetKey]
    );
  }
};

/**
 * Balm initialization
 */
const init = () => {
  // Before created
  ready();

  // Register task
  require('./tasks');

  logger.success('[Configuration]', config);
};

const checkGulpTask = name => {
  let result = false;

  if (isFunction(name)) {
    result = name;
  } else if (isString(name)) {
    if (Object.keys(gulp.tasks).includes(name)) {
      result = name;
    } else {
      logger.error('[Gulp Task]', 'Invalid task name');
    }
  } else {
    logger.warn('[Gulp Task]', 'Task must be a string or function');
  }

  return result;
};

export { setConfig, ready, init, checkGulpTask };
