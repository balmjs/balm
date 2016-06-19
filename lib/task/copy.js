class Copy {
  get name() {
    return 'copy';
  }
  get deps() {
    return [];
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
