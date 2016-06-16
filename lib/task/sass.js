class Sass {
  get name() {
    return 'sass';
  }
  get deps() {
    return ['sprites'];
  }
  get fn() {
    return () => {
      return gulp.src(config.source.css + '/**/*.scss')
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass.sync({
          outputStyle: 'expanded',
          precision: 10,
          includePaths: ['.']
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer({
          browsers: config.styles.autoprefixer
        }))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(config.tmp.css));
    };
  }
}

export default Sass;
