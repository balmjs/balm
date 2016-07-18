class CssMin extends Task {
  constructor() {
    super('cssmin');
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
