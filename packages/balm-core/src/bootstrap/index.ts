import checkConfig from './check_config.js';
import { ASSETS_KEYS } from '../config/constants.js';
import {
  LooseObject,
  DeepPartial,
  BalmConfig,
  BalmPath,
  BalmAssetsPath
} from '@balm-core/index';

function createQuickPath(
  config: BalmConfig,
  rootKey: string
): BalmPath | BalmAssetsPath {
  const result: LooseObject = {};

  const rootValue: string = (config.roots as LooseObject)[rootKey];
  for (const pathKey of Object.keys((config.paths as LooseObject)[rootKey])) {
    const pathValue: string = (config.paths as LooseObject)[rootKey][pathKey];
    result[pathKey] =
      rootKey === 'target' && ASSETS_KEYS.includes(pathKey)
        ? node.path.join(
            rootValue,
            BalmJS.config.assets.virtualDir,
            BalmJS.file.assetsSuffixPath,
            pathValue
          )
        : node.path.join(rootValue, pathValue);
  }

  return rootKey === 'source'
    ? (result as BalmPath)
    : (result as BalmAssetsPath);
}

function ready(config: BalmConfig): BalmConfig {
  // Create local quick directories
  config.src = createQuickPath(config, 'source');
  config.dest = createQuickPath(
    config,
    config.env.isProd || !config.inFrontend ? 'target' : 'tmp'
  ) as BalmAssetsPath;

  config.dest.static = node.path.join(
    config.dest.base,
    BalmJS.config.assets.virtualDir,
    BalmJS.file.assetsSuffixPath
  );

  // Create remote quick directories
  config.assets.static = node.path.join(
    config.assets.root,
    config.assets.mainDir,
    BalmJS.file.assetsSuffixPath
  );
  for (const assetKey of ASSETS_KEYS) {
    (config.assets as LooseObject)[assetKey] = node.path.join(
      config.assets.static,
      (config.paths.target as LooseObject)[assetKey]
    );
  }

  // Set HMR flag
  const HMR_ENV =
    config.useDefaults &&
    config.env.isDev &&
    !config.env.inSSR &&
    !config.env.isMP;
  const HMR_Enabling =
    config.scripts.bundler === BalmJS.Bundler.webpack && !config.scripts.ie8;
  config.server.useHMR = HMR_ENV && HMR_Enabling;

  // Set desktop app flag
  if (/^electron-.*/.test(config.scripts.target as string)) {
    config.env.inDesktopApp = true;
  }

  // Set use cache for webpack
  config.scripts.useCache =
    config.env.isProd && config.assets.cache && config.scripts.injectHtml;

  return config;
}

function resetConfig(): BalmConfig {
  BalmJS.config.roots.target = 'dist';
  BalmJS.config.roots.tmp = '.tmp';

  return BalmJS.config;
}

function setConfig(customConfig: DeepPartial<BalmConfig>): BalmConfig {
  const defaultConfig: BalmConfig = resetConfig();

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
  config = ready(config);
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
      BalmJS.logger.error('before/end task', 'Invalid gulp task name');
    }
  } else {
    BalmJS.logger.error(
      'before/end task',
      'Task must be a string (gulp task name) or function'
    );
  }

  return result;
}

export { setConfig, setTask };
