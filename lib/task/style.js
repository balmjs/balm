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
    return () => {
      let task = gulp.src(config.tmp.css + '/**/*.css', {
        base: config.tmp.base
      });

      if (!config.static) {
        if (config.production) {
          task.pipe($.cssnano({
            safe: true,
            autoprefixer: false,
            discardComments: {
              removeAll: true
            }
          }));
        }

        task.pipe(gulp.dest(config.target.base));
      }

      return task.pipe(reload({
        stream: true
      }));;
    };
  }
}

export default Style;
