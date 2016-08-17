class Style extends Task {
  constructor() {
    super('styles');
  }
  get deps() {
    return [this.getStyleTask()];
  }
  get fn() {
    return () => {
      if (config.production) {
        return gulp.src(config.tmp.css + '/**/*.css')
          .pipe($.cssnano({
            safe: true,
            autoprefixer: false,
            discardComments: {
              removeAll: true
            }
          }))
          // for assets
          .pipe($.replace(new RegExp(config.paths.source.img + '/', 'g'), config.paths.target.img + '/'))
          .pipe($.replace(new RegExp(config.paths.source.font + '/', 'g'), config.paths.target.font + '/'))
          .pipe(gulp.dest(this.dist));
      }
    };
  }
}

export default Style;
