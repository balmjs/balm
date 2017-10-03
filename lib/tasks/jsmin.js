class JsMin extends Task {
  constructor(input = '', output = '', renameOptions = {suffix: '.min'}, uglifyOptions = {}) {
    super('jsmin');

    this.input = input;
    this.output = output;
    this.renameOptions = renameOptions;
    this.uglifyOptions = uglifyOptions;
  }
  get fn() {
    return () => {
      let stream = gulp.src(this.getAbsPaths(this.input)).pipe($.plumber());

      stream = Object.keys(this.uglifyOptions).length
        ? stream.pipe($.uglify(this.uglifyOptions))
        : stream.pipe($.uglify());

      return stream
        .pipe($.rename(this.renameOptions))
        .pipe(gulp.dest(this.getAbsPaths(this.output)));
    };
  }
}

export default JsMin;
