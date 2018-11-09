class BalmTask {
  constructor(name) {
    this.name = name === 'default' ? name : getNamespace(name);
  }

  get deps() {
    return BalmJS.noop;
  }

  get task() {
    return BalmJS.noop;
  }

  get fn() {
    return series(this.deps, this.task);
  }

  getStyleTask() {
    return config.styles.ext === 'scss' ? 'sass' : config.styles.ext;
  }

  getStylePath() {
    return config.production
      ? path.join(
          config.roots.target,
          config.assets.subDir,
          config.paths.target.css
        )
      : path.join(config.roots.tmp, config.paths.tmp.css);
  }

  handleStyle(stream, output) {
    stream = config.production
      ? stream.pipe($.postcss([cssnano(config.styles.options)]))
      : stream.pipe($.if(!config.production, $.sourcemaps.write('.')));

    return stream
      .pipe(dest(BalmFile.absPaths(output)))
      .pipe(browserSync.stream());
  }

  getImageDist() {
    return config.production ? config.target.img : config.tmp.img;
  }
}

export default BalmTask;
