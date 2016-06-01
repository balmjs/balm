import gulpSass from 'gulp-sass'; // TODO: $.sass

class Sass {
  get name() {
    return 'sass';
  }
  get deps() {
    return ['sprites'];
  }
  get fn() {
    return () => {
      return gulp.src(config.app.css + '/**/*.scss')
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe(gulpSass.sync({
          outputStyle: 'expanded',
          precision: 10,
          includePaths: ['.']
        }).on('error', gulpSass.logError))
        .pipe($.autoprefixer({
          browsers: config.AUTOPREFIXER
        }))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(config.tmp.css))
        .pipe(reload({
          stream: true
        }));
    };
  }
}

export default Sass;
