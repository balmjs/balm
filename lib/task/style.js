class Style extends Task {
  constructor() {
    super('styles');
  }
  get deps() {
    return [this.getStyleTask()];
  }
  get fn() {
    return () => {
      let stream = gulp.src(config.tmp.css + '/**/*.css');

      if (config.production) {
        stream = stream
          .pipe($.cssnano(config.styles.options))
          // for assets
          .pipe($.replace(new RegExp(config.paths.source.img + '/', 'g'), config.paths.target.img + '/'))
          .pipe($.replace(new RegExp(config.paths.source.font + '/', 'g'), config.paths.target.font + '/'));
      }

      return stream.pipe(gulp.dest(this.dist));
    };
  }
}

export default Style;
