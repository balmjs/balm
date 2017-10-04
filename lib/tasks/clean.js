class Clean extends Task {
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
  getRemoteRoot() {
    return config.assets.root.trim().length
      ? [config.assets.root]
      : [];
  }
  getRemoteFolder() {
    return config.assets.subDir
      ? [config.assets.static]
      : [config.assets.css, config.assets.js, config.assets.img, config.assets.font, config.assets.media];
  }
  get fn() {
    let isLocal = !config.assets.root.includes('/');
    let folder = config.static
      ? [
        ...(config.production
          ? [File.absPaths(config.roots.target)]
          : [File.absPaths(config.roots.tmp)]),
        ...(isLocal
          ? this.getRemoteRoot()
          : this.getRemoteFolder())
      ]
      : [
        config.target.css,
        config.target.js,
        config.target.img,
        config.target.font,
        config.target.media,
        config.tmp.css,
        config.tmp.js,
        config.tmp.img,
        config.tmp.font,
        config.tmp.media,
        path.join(config.workspace, config.roots.tmp, config.paths.target.font) // Fix for dev
      ];

    folder = this.unique(folder);

    logger.error('[Clean]', folder); // Dangerous message

    return del.bind(null, folder, {force: true});
  }
}

export default Clean;
