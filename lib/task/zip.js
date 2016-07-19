class Zip extends Task {
  constructor() {
    super('zip');
  }
  get fn() {
    return (input = config.target.base + '/**/*', output = '.') => {
      return gulp.src(input)
        .pipe($.zip(config.zip))
        .pipe(gulp.dest(output));
    };
  }
}

export default Zip;
