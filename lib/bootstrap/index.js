import { tree } from 'gulp';
import { ASSETS_KEYS } from '../config/constants';
import { isString, isArray, isFunction, mergeDeep } from '../utilities';
import register from './register';
import DefaultTask from '../tasks/default';

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
      tmp: newConfig.paths.target
    }
  });

  // 3. For the dynamic project
  if (config.static) {
    config.assets.buildDir = '';
  } else {
    config.paths.tmp.font =
      config.paths.source.font.split('/').pop() || 'fonts'; // NOTE: fix for dev in non-static mode

    config.roots.target = config.assets.mainDir; // NOTE: `config.roots.target = 'public'`
    config.roots.tmp = config.roots.target;

    if (config.isDev) {
      config.assets.buildDir = '';
    }
  }

  // 4. Before created
  ready();
  logger.success('[Configuration]', config);
};

const ready = () => {
  // Create local quick directories
  for (let rootKey of Object.keys(config.roots)) {
    let rootValue = config.roots[rootKey];

    config[rootKey] = {};
    if (config.paths[rootKey]) {
      for (let pathKey of Object.keys(config.paths[rootKey])) {
        let pathValue = config.paths[rootKey][pathKey];
        config[rootKey][pathKey] =
          rootKey === 'target' && ASSETS_KEYS.includes(pathKey)
            ? path.join(
                config.workspace,
                rootValue,
                config.assets.subDir,
                config.assets.buildDir,
                pathValue
              )
            : path.join(config.workspace, rootValue, pathValue);
      }
    }
  }

  config.target.static = path.join(
    config.target.base,
    config.assets.subDir,
    config.assets.buildDir
  );

  if (config.assets.publicPath) {
    logger.warn(
      '[Balm Config]',
      '`config.assets.publicPath` was removed in balm@1.0.0, use `config.assets.mainDir` instead. (See https://balmjs.com/docs/en/configuration/publish.html#assets)'
    );
  }

  // Create remote quick directories
  config.assets.static = path.join(
    config.assets.root,
    config.assets.mainDir,
    config.assets.subDir,
    config.assets.buildDir
  );
  for (let assetKey of ASSETS_KEYS) {
    config.assets[assetKey] = path.join(
      config.assets.static,
      config.paths.target[assetKey]
    );
  }
};

const init = recipe => {
  // Register balm tasks
  register();
  recipe(BalmJS.mixins);

  // Register default task
  const defaultTask = new DefaultTask();
  task(defaultTask.name, series(defaultTask.tasks));
};

const checkGulpTask = name => {
  let result = false;

  if (isFunction(name)) {
    result = name;
  } else if (isString(name)) {
    if (tree().nodes.includes(name)) {
      result = name;
    } else {
      logger.error('[Gulp Task]', 'Invalid task name');
    }
  } else {
    logger.error('[Gulp Task]', 'Task must be a string or function');
  }

  return result;
};

export { setConfig, init, checkGulpTask };
