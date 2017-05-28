class Style extends BalmJS.Task {
  constructor() {
    super('styles');
  }
  getAssetsPath(type) {
    return $.replace(new RegExp(`${config.paths.source[type]}/`, 'g'), `${config.paths.target[type]}/`);
  }
  get deps() {
    return [this.getStyleTask()];
  }
  get fn() {
    return config.production
      ? () => {
        return gulp.src(`${config.target.css}/**/*.css`)
          .pipe(this.getAssetsPath('img'))
          .pipe(this.getAssetsPath('font')) // For assets
          .pipe(gulp.dest(config.target.css));
      }
      : BalmJS.noop;
  }
}

export default Style;
