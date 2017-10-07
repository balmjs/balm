class Copy extends Task {
  constructor(input = '', output = '', renameOptions = {}) {
    super('copy');

    this.input = input;
    this.output = output;
    this.renameOptions = renameOptions;
  }
  get fn() {
    return () => {
      return gulp.src(File.absPaths(this.input))
        .pipe($.rename(this.renameOptions))
        .pipe(gulp.dest(File.absPaths(this.output)));
    };
  }
}

export default Copy;
