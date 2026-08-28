import path from 'node:path';
import { BalmConfig, BalmCustomConfig } from '../types/index.js';
import { createDefaultConfig } from './defaults.js';
import { deepMerge } from '../utilities/utils.js';
import { ASSETS_TYPES } from './constants.js';
import { setWorkspaces } from '../utilities/workspace.js';

export function resolveConfig(
  customConfig: BalmCustomConfig = {},
  defaultWorkspace = process.cwd()
): BalmConfig {
  let localWorkspace = defaultWorkspace;
  let globalWorkspace = path.resolve(defaultWorkspace, '..');

  if (customConfig.workspace) {
    if (typeof customConfig.workspace === 'string') {
      localWorkspace = path.resolve(customConfig.workspace);
      globalWorkspace = path.resolve(localWorkspace, '..');
    } else if (typeof customConfig.workspace === 'object') {
      localWorkspace = path.resolve(customConfig.workspace.local || defaultWorkspace);
      globalWorkspace = path.resolve(
        customConfig.workspace.global || path.resolve(localWorkspace, '..')
      );
    }
  }

  setWorkspaces(localWorkspace, globalWorkspace);

  const defaultConfig = createDefaultConfig(localWorkspace);
  const config = deepMerge(defaultConfig, customConfig) as BalmConfig;

  // Set normalized workspace path
  config.workspace = localWorkspace;
  config.workspaces = {
    local: localWorkspace,
    global: globalWorkspace
  };

  // Update src quick directories
  config.src = {
    base: path.join(config.workspace, config.roots.source),
    html: path.join(config.workspace, config.roots.source, config.paths.source.html),
    css: path.join(config.workspace, config.roots.source, config.paths.source.css),
    js: path.join(config.workspace, config.roots.source, config.paths.source.js),
    img: path.join(config.workspace, config.roots.source, config.paths.source.img),
    font: path.join(config.workspace, config.roots.source, config.paths.source.font),
    media: path.join(config.workspace, config.roots.source, config.paths.source.media)
  };

  // Update dest quick directories
  const targetBase = path.join(
    config.workspace,
    config.env.isProd || !config.inFrontend ? config.roots.target : config.roots.tmp
  );

  const isProd = config.env.isProd || !config.inFrontend;
  const pathMap = isProd ? config.paths.target : config.paths.tmp;

  const destStatic = path.join(
    targetBase,
    config.assets.virtualDir,
    config.assets.subDir
  );

  config.dest = {
    base: targetBase,
    html: targetBase,
    css: path.join(targetBase, pathMap.css),
    js: path.join(targetBase, pathMap.js),
    img: path.join(targetBase, pathMap.img),
    font: path.join(targetBase, pathMap.font),
    media: path.join(targetBase, pathMap.media),
    static: destStatic
  };

  // Set assets.static
  config.assets.static = path.join(
    config.assets.root,
    config.assets.mainDir,
    config.assets.subDir
  );

  for (const assetType of ASSETS_TYPES) {
    (config.assets as any)[assetType] = path.join(
      config.assets.static,
      (config.paths.target as any)[assetType]
    );
  }

  // Set HMR flag
  const hmrEnv =
    config.useDefaults &&
    config.env.isDev &&
    !config.env.inSSR &&
    !config.env.isMP;
  const hmrEnabling = config.scripts.bundler === 'webpack';
  config.server.useHMR = hmrEnv && hmrEnabling;

  // Set desktop app
  if (/^electron-.*/.test(config.scripts.target as string)) {
    config.env.inDesktopApp = true;
  }

  // Set use cache for webpack
  config.scripts.useCache =
    config.env.isProd && config.assets.cache && config.scripts.injectHtml;

  return config;
}

export * from './constants.js';
export * from './defaults.js';
