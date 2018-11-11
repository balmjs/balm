import { ASSETS_KEYS } from '../config/constants';

class Clean extends BalmTask {
  constructor() {
    super('clean');
  }

  unique(arr) {
    let obj = {};
    let result = [];

    for (let i = 0, len = arr.length; i < len; i++) {
      if (!obj[arr[i]]) {
        obj[arr[i]] = true;
        result.push(arr[i]);
      }
    }

    return result;
  }

  getAssetsDir(rootKey = 'assets') {
    return ASSETS_KEYS.map(assetKey => config[rootKey][assetKey]);
  }

  getRemoteRoot() {
    return config.assets.root.trim().length ? [config.assets.root] : [];
  }

  getRemoteFolder() {
    return config.assets.subDir ? [config.assets.static] : this.getAssetsDir();
  }

  get fn() {
    return callback => {
      let isLocal = !config.assets.root.includes('/');

      let folder = config.static
        ? config.production
          ? [
              BalmFile.absPaths(config.roots.target),
              ...(isLocal ? this.getRemoteRoot() : this.getRemoteFolder())
            ]
          : [
              BalmFile.absPaths(config.roots.tmp),
              ...(isLocal ? this.getRemoteRoot() : [])
            ]
        : [
            ...this.getAssetsDir('target'),
            ...this.getAssetsDir('tmp'),
            path.join(
              config.workspace,
              config.roots.tmp,
              config.paths.target.font
            ) // Fix for dev
          ];

      folder = this.unique(folder);

      logger.error('[Clean]', folder); // Dangerous message

      del.bind(null, folder, { force: true });
      callback();
    };
  }
}

export default Clean;
