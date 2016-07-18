class Copy extends Task {
  constructor() {
    super('copy');
  }
  get fn() {
    return (input = '', output = '') => {
      if (input && output) {
        return gulp.src(input)
          .pipe(gulp.dest(output));
      }
    };
  }
}

export default Copy;
