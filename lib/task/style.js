class Style {
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
  get name() {
    return 'styles';
  }
  get deps() {
    return [this.getStyleTask()];
  }
  get fn() {
    return () => {
      let task = gulp.src(config.tmp.css + '/**/*.css')
        .pipe($.plumber());

      if (!config.static) {
        if (config.production) {
          return task
            .pipe($.cssnano({
              safe: true,
              autoprefixer: false,
              discardComments: {
                removeAll: true
              }
            }))
            .pipe(gulp.dest(config.target.css));
        } else {
          task.pipe(gulp.dest(config.target.css));
        }
      }

      return task.pipe(reload({
        stream: true
      }));
    };
  }
}

export default Style;
