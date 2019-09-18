import { tree } from 'gulp';
import { ASSETS_KEYS } from '../config/constants';

function _createQuickPath(config: any, rootKey: string): any {
  const result: any = {};

  const rootValue = config.roots[rootKey];
  for (const pathKey of Object.keys(config.paths[rootKey])) {
    const pathValue = config.paths[rootKey][pathKey];
    result[pathKey] =
      rootKey === 'target' && ASSETS_KEYS.includes(pathKey)
        ? path.join(
            rootValue,
            config.assets.subDir,
            config.assets.buildDir,
            pathValue
          )
        : path.join(rootValue, pathValue);
  }

  return result;
}

function _ready(config: any): any {
  // Create local quick directories
  config.src = _createQuickPath(config, 'source');
  config.dest = _createQuickPath(
    config,
    config.env.isProd || !config.inFrontend ? 'target' : 'tmp'
  );

  // Note: fix for dev in backend mode
  if (!config.inFrontend && config.env.isDev) {
    config.dest.font = path.join(config.roots.target, config.paths.tmp.font);
  }

  config.dest.static = path.join(
    config.dest.base,
    config.assets.subDir,
    config.assets.buildDir
  );

  // Create remote quick directories
  config.assets.static = path.join(
    config.assets.root,
    config.assets.mainDir,
    config.assets.subDir,
    config.assets.buildDir
  );
  for (const assetKey of ASSETS_KEYS) {
    config.assets[assetKey] = path.join(
      config.assets.static,
      config.paths.target[assetKey]
    );
  }

  return config;
}

function setConfig(customConfig: any = {}): any {
  const defaultConfig: any = BalmJS.config;

  // 1. Overwrite config
  const newConfig: any = BalmJS.utils.mergeDeep(defaultConfig, customConfig);
  // checkConfig(); TODO: for compatibility

  // 2. Copy `config.paths.target` to `config.paths.tmp`
  let config: any = BalmJS.utils.mergeDeep(newConfig, {
    paths: {
      tmp: newConfig.paths.target
    }
  });

  // 3. For the dynamic project
  if (config.inFrontend) {
    config.assets.buildDir = '';
  } else {
    config.paths.tmp.font =
      config.paths.source.font.split('/').pop() || 'fonts'; // NOTE: fix for dev in non-static mode

    config.roots.target = config.assets.mainDir; // NOTE: `config.roots.target = 'public'`
    config.roots.tmp = config.roots.target;

    if (config.env.isDev) {
      config.assets.buildDir = '';
    }
  }

  // 4. Before created
  config = _ready(config);
  if (BalmJS.config.logs.level <= BalmJS.LogLevel.Debug) {
    BalmJS.logger.success('<configuration>', config);
  }

  return config;
}

function checkGulpTask(name: any): string | boolean | Function {
  let result: string | boolean | Function = false;

  if (BalmJS.utils.isFunction(name)) {
    result = name as Function;
  } else if (BalmJS.utils.isString(name)) {
    if (tree().nodes.includes(name)) {
      result = name as string;
    } else {
      BalmJS.logger.error('<gulp task>', 'Invalid task name');
    }
  } else {
    BalmJS.logger.error('<gulp task>', 'Task must be a string or function');
  }

  return result;
}

export { setConfig, checkGulpTask };
