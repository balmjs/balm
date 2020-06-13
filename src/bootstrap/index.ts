import { ASSETS_KEYS } from '../config/constants';
import checkConfig from './check_config';

function _createQuickPath(config: any, rootKey: string): any {
  const result: any = {};

  const rootValue: string = config.roots[rootKey];
  for (const pathKey of Object.keys(config.paths[rootKey])) {
    const pathValue: string = config.paths[rootKey][pathKey];
    result[pathKey] =
      rootKey === 'target' && ASSETS_KEYS.includes(pathKey)
        ? path.join(
            rootValue,
            BalmJS.config.assets.virtualDir,
            BalmJS.file.assetsSuffixPath,
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

  config.dest.static = path.join(
    config.dest.base,
    BalmJS.config.assets.virtualDir,
    BalmJS.file.assetsSuffixPath
  );

  // Create remote quick directories
  config.assets.static = path.join(
    config.assets.root,
    config.assets.mainDir,
    BalmJS.file.assetsSuffixPath
  );
  for (const assetKey of ASSETS_KEYS) {
    config.assets[assetKey] = path.join(
      config.assets.static,
      config.paths.target[assetKey]
    );
  }

  return config;
}

function _resetConfig(): any {
  BalmJS.config.roots.target = 'dist';
  BalmJS.config.roots.tmp = '.tmp';

  return BalmJS.config;
}

function setConfig(customConfig: any): any {
  const defaultConfig: any = _resetConfig();

  // 1. Overwrite config
  const newConfig: any = BalmJS.utils.deepMerge(defaultConfig, customConfig);
  checkConfig();

  // 2. Copy `config.paths.target` to `config.paths.tmp`
  let config: any = BalmJS.utils.deepMerge(newConfig, {
    paths: {
      tmp: newConfig.paths.target
    }
  });

  // 3. For the dynamic project
  if (!config.inFrontend) {
    if (config.roots.target === 'dist') {
      config.roots.target = config.assets.mainDir; // NOTE: `BalmJS.config.roots.target = 'public'` for back-end project
    }
    config.roots.tmp = config.roots.target;
  }

  // 4. Before created
  config = _ready(config);
  BalmJS.logger.success('balm configuration', config, {
    pre: true
  });

  return config;
}

function setTask(name: string | Function): string | Function | undefined {
  let result: string | Function | undefined = undefined;

  if (BalmJS.utils.isFunction(name)) {
    result = name as Function;
  } else if (BalmJS.utils.isString(name)) {
    if ((gulp.tree().nodes as string[]).includes(name as string)) {
      result = name as string;
    } else {
      BalmJS.logger.error('gulp task', 'Invalid task name');
    }
  } else {
    BalmJS.logger.error('gulp task', 'Task must be a string or function');
  }

  return result;
}

export { setConfig, setTask };
