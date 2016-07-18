class Style extends Task {
  constructor() {
    super('styles');
  }
  getStyleTask() {
    let styleName;

    switch (config.styles.ext) {
      case 'css':
        styleName = 'css';
        break;
      case 'sass':
      case 'scss':
        styleName = 'sass';
        break;
      case 'less':
        styleName = 'less';
        break;
    }

    return styleName;
  }
  get deps() {
    return [this.getStyleTask()];
  }
  get fn() {
    return () => {
      let stream = gulp.src(config.tmp.css + '/**/*.css')
        .pipe($.plumber());

      if (!config.production) {
        return stream.pipe(reload({
          stream: true
        }));
      } else {
        return stream.pipe($.cssnano({
            safe: true,
            autoprefixer: false,
            discardComments: {
              removeAll: true
            }
          }))
          .pipe(gulp.dest(this.dist));
      }
    };
  }
}

export default Style;
