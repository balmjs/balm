class Sass {
  get name() {
    return 'sass';
  }
  get deps() {
    return ['sprites'];
  }
  get fn() {
    return (input = '', output = config.tmp.css) => {
      input = (typeof input !== 'function') ? input : config.source.css + '/**/*.scss'; // TODO: input type is function???

      return gulp.src(input)
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
        .pipe(gulp.dest(output));
    };
  }
}

export default Sass;
