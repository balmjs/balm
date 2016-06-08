import { getStyleTask } from '../helper';

class Style {
  get name() {
    return 'styles';
  }
  get deps() {
    return [getStyleTask()];
  }
  get fn() {
    return () => {
      return gulp.src(config.tmp.css + '/**/*.css')
        .pipe($.cssnano({
          safe: true,
          autoprefixer: false,
          discardComments: {
            removeAll: true
          }
        }))
        .pipe(gulp.dest(config.target.css));
    };
  }
}

export default Style;
