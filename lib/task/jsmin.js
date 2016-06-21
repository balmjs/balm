class JsMin {
  get name() {
    return 'jsmin';
  }
  get deps() {
    return [];
  }
  get fn() {
    return (input = '', output = '') => {
      if (input && output) {
        return gulp.src(input)
          .pipe($.plumber())
          .pipe($.uglify())
          .pipe(gulp.dest(output));
      }
    };
  }
}

export default JsMin;
