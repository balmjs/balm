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
      return gulp.src(config.app.html + '/*.html')
        .pipe($.useref({
          searchPath: [config.tmp.html, config.app.html, '.']
        }))
        // .pipe($.if('*.js', $.uglify())) // use webpack
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
        .pipe(gulp.dest(config.dist.html));
    };
  }
}

export default Html;
