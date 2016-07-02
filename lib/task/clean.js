class Clean {
  get name() {
    return 'clean';
  }
  get deps() {
    return [];
  }
  get fn() {
    let folder = [
      config.roots.cache,
      config.cacheDir,
      ...(config.static ? [
        config.roots.tmp,
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
