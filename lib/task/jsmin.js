class JsMin extends BalmJS.Task {
  constructor() {
    super('jsmin');
  }
  get recipe() {
    return true;
  }
  get fn() {
    return (input = '', output = '', renameObj = {suffix: '.min'}, options = {}) => {
      let stream = gulp.src(this.getAbsPaths(input)).pipe($.plumber());

      stream = Object.keys(options).length
        ? stream.pipe($.uglify(options))
        : stream.pipe($.uglify());

      return stream
        .pipe($.rename(renameObj))
        .pipe(gulp.dest(this.getAbsPaths(output)));
    };
  }
}

export default JsMin;
