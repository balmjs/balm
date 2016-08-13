class Clean extends Task {
  constructor() {
    super('clean');
  }
  unique(arr) {
    let n = {};
    let r = [];
    for (let i = 0; i < arr.length; i++) {
      if (!n[arr[i]]) {
        n[arr[i]] = true;
        r.push(arr[i]);
      }
    }
    return r;
  }
  get fn() {
    let assets = config.assets.subDir ? [config.assets.base] : [
      config.assets.css,
      config.assets.js,
      config.assets.img,
      config.assets.font
    ];

    let folder = [
      ...(config.static ? [
        path.join(config.workspace, config.roots.tmp),
        path.join(config.workspace, config.roots.target)
      ] : [
        config.target.css,
        config.target.js,
        config.target.img,
        config.target.font
      ]),
      ...((config.assets.root === 'assets') ? [config.assets.root] : assets)
    ];

    folder = this.unique(folder);

    if (config.debug) {
      $.util.log($.util.colors.yellow('Clean:'), RN, folder, RN);
    }

    return require('del').bind(null, folder, {
      force: true
    });
  }
}

export default Clean;
