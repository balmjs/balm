class CssMin {
  get name() {
    return 'cssmin';
  }
  get deps() {
    return [];
  }
  get fn() {
    return (input = '', output = '') => {
      if (input && output) {
        return gulp.src(input)
          .pipe($.cssnano({
            safe: true,
            autoprefixer: false
          }))
          .pipe(gulp.dest(output));
      }
    };
  }
}

export default CssMin;
