class Zip extends Task {
  constructor() {
    super('zip');
  }
  get fn() {
    return (input = this.input, output = this.output) => {
      return gulp.src(this.getAbsPaths(input))
        .pipe($.zip(config.zip))
        .pipe(gulp.dest(output));
    };
  }
}

export default Zip;
