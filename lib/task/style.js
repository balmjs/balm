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
          .pipe($.replace(config.html.regex.font, this.publicFontPath)) // for assets
          .pipe(gulp.dest(this.dist));
      }
    };
  }
}

export default Style;
