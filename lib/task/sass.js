class Sass {
  get name() {
    return 'sass';
  }
  get deps() {
    let tasks = [];

    if (config.sprites.image.length) {
      tasks.push('sprites');
    }
    if (config.sprites.svg.length) {
      tasks.push('svg');
    }

    return tasks;
  }
  get fn() {
    return (input = config.source.css + '/**/*.scss', output = config.tmp.css) => {
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
