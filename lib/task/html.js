import { getStyleTask } from '../helper';

class Html {
  get name() {
    return 'html';
  }
  get deps() {
    let tasks = ['scripts'];
    tasks.unshift(getStyleTask());
    return tasks;
  }
  get fn() {
    return () => {
      return gulp.src(config.app.base + '/*.html')
        .pipe($.useref({
          searchPath: [config.tmp.base, config.app.base, '.']
        }))
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.cssnano({
          safe: true,
          autoprefixer: false,
          discardComments: {
            removeAll: true
          }
        })))
        .pipe($.if('*.html', $.htmlmin({
          collapseWhitespace: true
        })))
        .pipe(gulp.dest(config.dist.base));
    };
  }
}

export default Html;
