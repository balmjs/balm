class Clean extends Task {
  constructor() {
    super('clean');
  }
  get fn() {
    let folder = [
      config.roots.cache,
      config.cacheDir,
      ...(!config.proxy ? [config.roots.tmp] : []),
      ...(config.static ? [
        config.roots.target
      ] : [
        config.target.css,
        config.target.js,
        config.target.img,
        config.target.font
      ])
    ];

    return del.bind(null, folder);
  }
}

export default Clean;
