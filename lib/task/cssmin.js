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
          .pipe($.plumber())
          .pipe($.cssnano({
            safe: true,
            autoprefixer: false,
            discardComments: {
              removeAll: true
            }
          }))
          .pipe(gulp.dest(output));
      }
    };
  }
}

export default CssMin;
