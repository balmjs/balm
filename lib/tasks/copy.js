class Copy extends BalmJS.Task {
  constructor() {
    super('copy');
  }
  get recipe() {
    return true;
  }
  get fn() {
    return (input = '', output = '', renameObj = {}) => {
      return gulp.src(input)
        .pipe($.rename(renameObj))
        .pipe(gulp.dest(output));
    };
  }
}

export default Copy;
