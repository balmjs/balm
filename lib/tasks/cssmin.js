class CssMin extends Task {
  constructor(input = '', output = '', renameOptions = {suffix: '.min'}) {
    super('cssmin');

    this.input = input;
    this.output = output;
    this.renameOptions = renameOptions;
  }
  get fn() {
    return () => {
      return gulp.src(this.getAbsPaths(this.input))
        .pipe($.cssnano(config.styles.options))
        .pipe($.rename(this.renameOptions))
        .pipe(gulp.dest(this.getAbsPaths(this.output)));
    };
  }
}

export default CssMin;
