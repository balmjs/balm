class Clean extends Task {
  constructor() {
    super('clean');

    this.canDel = {
      tmp: config.roots.tmp.trim().length > 1,
      target: config.roots.target.trim().length > 1,
      assets: config.assets.root.trim().length > 1
    };
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
  getRemoteRoot() {
    return this.canDel.assets ? [config.assets.root] : [];
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
        ...(this.canDel.tmp ? [path.join(config.workspace, config.roots.tmp)] : []),
        ...(this.canDel.target ? [path.join(config.workspace, config.roots.target)] : []),
        ...(isLocal ? this.getRemoteRoot() : this.getRemoteFolder())
      ] : [
        config.tmp.css, config.tmp.js, config.tmp.img, config.tmp.font,
        config.target.css, config.target.js, config.target.img, config.target.font,
        path.join(config.workspace, config.roots.tmp, config.paths.target.font) // fix for dev
      ])
    ];

    folder = this.unique(folder);

    if (config.debug) {
      $.util.log($.util.colors.yellow('Clean:'), RN, folder, RN);
    }

    return del.bind(null, folder, {
      force: true
    });
  }
}

export default Clean;
