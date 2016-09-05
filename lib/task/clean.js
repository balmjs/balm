class Clean extends BalmJS.Task {
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
    return config.assets.root.trim().length ? [config.assets.root] : [];
  }
  getRemoteFolder() {
    return config.assets.subDir ? [config.assets.static] : [
      config.assets.css,
      config.assets.js,
      config.assets.img,
      config.assets.font
    ];
  }
  get fn() {
    let isLocal = config.assets.root.indexOf('/') === -1;
    let folder = [
      ...(config.static ? [
        ...(config.roots.tmp.trim().length ? [path.join(config.workspace, config.roots.tmp)] : []),
        ...(config.roots.target.trim().length ? [path.join(config.workspace, config.roots.target)] : []),
        ...(isLocal ? this.getRemoteRoot() : this.getRemoteFolder())
      ] : [
        config.tmp.css, config.tmp.js, config.tmp.img, config.tmp.font,
        config.target.css, config.target.js, config.target.img, config.target.font,
        path.join(config.workspace, config.roots.tmp, config.paths.target.font) // fix for dev
      ])
    ];

    folder = this.unique(folder);

    BalmJS.log('Clean', folder, 'danger');

    return del.bind(null, folder, {
      force: true
    });
  }
}

export default Clean;
