class CssMin extends Task {
  constructor(input = '', output = '', renameOptions = { suffix: '.min' }) {
    super('cssmin');

    this.input = input;
    this.output = output;
    this.renameOptions = renameOptions;
  }

  get fn() {
    return () => {
      return gulp
        .src(File.absPaths(this.input))
        .pipe($.cssnano(config.styles.options))
        .pipe($.rename(this.renameOptions))
        .pipe(gulp.dest(File.absPaths(this.output)));
    };
  }
}

export default CssMin;
