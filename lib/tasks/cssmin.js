class CssMin extends BalmJS.Task {
  constructor() {
    super('cssmin');
  }
  get recipe() {
    return true;
  }
  get fn() {
    return (input = '', output = '', renameObj = {suffix: '.min'}) => {
      return gulp.src(this.getAbsPaths(input))
        .pipe($.cssnano(config.styles.options))
        .pipe($.rename(renameObj))
        .pipe(gulp.dest(this.getAbsPaths(output)));
    };
  }
}

export default CssMin;
