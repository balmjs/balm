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

  get remoteFolder() {
    return config.assets.subDir ? [config.assets.static] : this.getAssetsDir();
  }

  get fn() {
    return () => {
      let isLocal = !config.assets.root.includes('/');

      let folder = config.static
        ? config.isProd
          ? [
              BalmFile.absPaths(config.roots.target),
              ...(isLocal ? this.remoteRoot : this.remoteFolder)
            ]
          : [
              BalmFile.absPaths(config.roots.tmp),
              ...(isLocal ? this.remoteRoot : [])
            ]
        : [
            ...this.getAssetsDir('target'),
            path.join(config.target.static, config.paths.tmp.font) // Fix for dev
          ];

      folder = unique(folder);

      return del(folder, { force: true }).then(() => {
        logger.warn('[Clean Task]', folder); // Dangerous message
      });
    };
  }
}

export default CleanTask;
