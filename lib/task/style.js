import {
  getStyleTask
} from '../helper';

class Style {
  get name() {
    return 'styles';
  }
  get deps() {
    return [getStyleTask()];
  }
  get fn() {
    if (!config.static) {
      return () => {
        let task = gulp.src(config.tmp.css + '/**/*.css', {
          base: config.tmp.base
        });

        if (config.production) {
          task.pipe($.cssnano({
            safe: true,
            autoprefixer: false,
            discardComments: {
              removeAll: true
            }
          }));
        }

        return task.pipe(gulp.dest(config.target.base))
          .pipe(reload({
            stream: true
          }));;
      };
    }
  }
}

export default Style;
