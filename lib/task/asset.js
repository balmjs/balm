class Asset extends Task {
  constructor() {
    super('assets');
  }
  get deps() {
    return ['version'];
  }
  get fn() {
    return () => {
      return gulp.src([
        config.target.base + '/*.*',
        '!' + config.target.html + '/*.html'
      ]).pipe(gulp.dest(path.join(config.assets.root, config.assets.publicPath)));
    };
  }
}

export default Asset;
