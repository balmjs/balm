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
    let folder = [
      ...(config.static ? [
        path.join(config.workspace, config.roots.tmp),
        path.join(config.workspace, config.roots.target)
      ] : [
        config.tmp.css,
        config.tmp.js,
        config.tmp.img,
        config.tmp.font,
        config.target.css,
        config.target.js,
        config.target.img,
        config.target.font
      ]),
      ...(config.assets.subDir ? [
        (config.assets.root.indexOf('/') === -1 ?
          config.assets.root :
          config.assets.static)
      ] : [
        config.assets.css,
        config.assets.js,
        config.assets.img,
        config.assets.font
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
