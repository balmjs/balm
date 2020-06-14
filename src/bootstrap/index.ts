import { ASSETS_KEYS } from '../config/constants';
import { LooseObject, BalmConfig, BalmPath, BalmAssetsPath } from '@balm/index';
import checkConfig from './check_config';

function _createQuickPath(
  config: BalmConfig,
  rootKey: string
): BalmPath | BalmAssetsPath {
  const result: LooseObject = {};

  const rootValue: string = (config.roots as LooseObject)[rootKey];
  for (const pathKey of Object.keys((config.paths as LooseObject)[rootKey])) {
    const pathValue: string = (config.paths as LooseObject)[rootKey][pathKey];
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

  return rootKey === 'source'
    ? (result as BalmPath)
    : (result as BalmAssetsPath);
}

function _ready(config: BalmConfig): BalmConfig {
  // Create local quick directories
  config.src = _createQuickPath(config, 'source');
  config.dest = _createQuickPath(
    config,
    config.env.isProd || !config.inFrontend ? 'target' : 'tmp'
  ) as BalmAssetsPath;

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
    (config.assets as LooseObject)[assetKey] = path.join(
      config.assets.static,
      (config.paths.target as LooseObject)[assetKey]
    );
  }

  return config;
}

function _resetConfig(): any {
  BalmJS.config.roots.target = 'dist';
  BalmJS.config.roots.tmp = '.tmp';

  return BalmJS.config;
}

function setConfig(customConfig: BalmConfig): any {
  const defaultConfig: BalmConfig = _resetConfig();

  // 1. Overwrite config
  const newConfig: BalmConfig = BalmJS.utils.deepMerge(
    defaultConfig,
    customConfig
  ) as BalmConfig;
  checkConfig();

  // 2. Copy `config.paths.target` to `config.paths.tmp`
  let config: BalmConfig = BalmJS.utils.deepMerge(newConfig, {
    paths: {
      tmp: newConfig.paths.target
    }
  }) as BalmConfig;

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
