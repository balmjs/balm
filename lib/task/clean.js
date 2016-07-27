class Clean extends Task {
  constructor() {
    super('clean');
  }
  get fn() {
    let canCleanCss = config.paths.source.css;
    let canCleanJs = config.paths.source.js;
    let canCleanImg = config.paths.source.img;
    let canCleanFont = config.paths.source.font;
    let canCleanTmp = !config.proxy;

    if (!canCleanCss || !canCleanJs || !canCleanImg || !canCleanFont) {
      canCleanTmp = false;
    }

    let folder = [
      path.join(config.workspace, config.roots.cache),
      config.cache.dir,
      ...(canCleanTmp ? [path.join(config.workspace, config.roots.tmp)] : []),
      ...(config.static ? [
        path.join(config.workspace, config.roots.target)
      ] : [
        config.target.css,
        config.target.js,
        config.target.img,
        config.target.font
      ])
    ];

    return del.bind(null, folder, { force: true });
  }
}

export default Clean;
