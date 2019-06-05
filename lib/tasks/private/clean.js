import { ASSETS_KEYS } from '../../config/constants';

const unique = arr => {
  let obj = {};
  let result = [];

  for (let i = 0, len = arr.length; i < len; i++) {
    if (!obj[arr[i]]) {
      obj[arr[i]] = true;
      result.push(arr[i]);
    }
  }

  return result;
};

class CleanTask extends BalmTask {
  constructor() {
    super('clean');
  }

  getAssetsDir(rootKey = 'assets') {
    return ASSETS_KEYS.map(assetKey => config[rootKey][assetKey]);
  }

  get remoteRoot() {
    return config.assets.root.trim().length ? [config.assets.root] : [];
  }

  get remoteDir() {
    return config.assets.subDir ? [config.assets.static] : this.getAssetsDir();
  }

  get staticDir() {
    let isLocal = !config.assets.root.includes('/');

    return config.isProd
      ? [
          BalmFile.absPaths(config.roots.target),
          ...(isLocal ? this.remoteRoot : this.remoteDir)
        ]
      : [BalmFile.absPaths(config.roots.tmp)];
  }

  get nonStaticDir() {
    let buildDir = config.assets.subDir ? [config.target.static] : [];

    return [
      ...(config.isProd && config.assets.subDir
        ? buildDir
        : [
            ...this.getAssetsDir('target'),
            path.join(config.target.static, config.paths.tmp.font) // Note: fix for dev in non-static mode
          ])
    ];
  }

  get fn() {
    return () => {
      let directories = config.static ? this.staticDir : this.nonStaticDir;
      directories = unique(directories);

      return del(directories, { force: true }).then(() => {
        logger.warn('[Clean Task]', directories); // Dangerous message
      });
    };
  }
}

export default CleanTask;
