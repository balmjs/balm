class Clean extends Task {
  constructor() {
    super('clean');
  }
  get fn() {
    let folder = [
      path.join(config.workspace, config.roots.cache),
      config.cache.dir,
      ...(!config.proxy ? [path.join(config.workspace, config.roots.tmp)] : []),
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
