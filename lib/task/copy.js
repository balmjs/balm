class Copy extends Task {
  constructor() {
    super('copy');
  }
  get fn() {
    return (input = '', output = '', renameObj = {}) => {
      if (input && output) {
        return gulp.src(this.getAbsPaths(input))
          .pipe($.rename(renameObj))
          .pipe(gulp.dest(output));
      }
    };
  }
}

export default Copy;
