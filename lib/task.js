class Task {
  constructor(name) {
    this.name = name;
  }
  get deps() {
    return [];
  }
  get fn() {
    return BalmJS.noop;
  }
  getStyleTask() {
    return config.styles.ext === 'scss'
      ? 'sass'
      : config.styles.ext;
  }
  getStylePath() {
    return config.production
      ? path.join(config.roots.target, config.assets.subDir, config.paths.target.css)
      : path.join(config.roots.tmp, config.paths.tmp.css);
  }
  handleStyle(stream, output) {
    stream = config.production
      ? stream.pipe($.cssnano(config.styles.options))
      : stream.pipe($.if(!config.production, $.sourcemaps.write('.')));

    return stream
      .pipe(gulp.dest(File.absPaths(output)))
      .pipe(browserSync.stream());
  }
  getImageDist() {
    return config.production
      ? config.target.img
      : config.tmp.img;
  }
}

export default Task;
