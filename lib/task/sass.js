class Sass extends Task {
  constructor() {
    super('sass');
  }
  get deps() {
    return this.getSpriteTasks();
  }
  get fn() {
    return (input = config.source.css + '/**/*.scss', output = config.tmp.css) => {
      return gulp.src(input)
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass.sync({
          outputStyle: 'expanded',
          precision: 10,
          includePaths: [path.join(config.workspace, '.')]
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer({
          browsers: config.styles.autoprefixer
        }))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(output))
        .pipe(reload({ stream: true }));
    };
  }
}

export default Sass;
