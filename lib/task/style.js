class Style extends BalmJS.Task {
  constructor() {
    super('styles');

    this.dist = config.production
      ? config.target.css
      : config.tmp.css;
  }
  getAssetsPath(type) {
    return $.replace(new RegExp(`${config.paths.source[type]}/`, 'g'), `${config.paths.target[type]}/`);
  }
  get deps() {
    return [this.getStyleTask()];
  }
  get fn() {
    return () => {
      let stream = gulp.src(`${config.tmp.css}/**/*.css`);

      if (config.production) {
        stream = stream
          .pipe($.cssnano(config.styles.options))
          .pipe(this.getAssetsPath('img'))
          .pipe(this.getAssetsPath('font')); // For assets
      }

      return stream.pipe(gulp.dest(this.dist));
    };
  }
}

export default Style;
