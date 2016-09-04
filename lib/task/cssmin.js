class CssMin extends BalmJS.Task {
  constructor() {
    super('cssmin');
  }
  get fn() {
    return (input = '', output = '') => {
      return gulp.src(this.getAbsPaths(input))
        .pipe($.cssnano(config.styles.options))
        .pipe(gulp.dest(output));
    };
  }
}

export default CssMin;
