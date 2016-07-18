class Less extends Task {
  constructor() {
    super('less');
  }
  get deps() {
    return this.getSpriteTask();
  }
  get fn() {
    return (input = [config.source.css + '/**/*.less', '!' + config.source.css + '/**/_*.less'], output = config.tmp.css) => {
      return gulp.src(input)
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.less())
        .pipe($.autoprefixer({
          browsers: config.styles.autoprefixer
        }))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(output));
    };
  }
}

export default Less;
