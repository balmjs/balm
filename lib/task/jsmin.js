class JsMin extends Task {
  constructor() {
    super('jsmin');
  }
  get fn() {
    return (input = '', output = '', options = {}) => {
      if (input && output) {
        let stream = gulp.src(this.getAbsPaths(input))
          .pipe($.plumber());

        stream = Object.keys(options).length ? stream.pipe($.uglify(options)) : stream.pipe($.uglify());

        return stream.pipe(gulp.dest(output));
      }
    };
  }
}

export default JsMin;
