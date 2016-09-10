class JsMin extends BalmJS.Task {
  constructor() {
    super('jsmin');
  }
  get recipe() {
    return true;
  }
  get fn() {
    return (input = '', output = '', options = {}) => {
      let stream = gulp.src(this.getAbsPaths(input));

      stream = Object.keys(options).length ?
        stream.pipe($.uglify(options)) :
        stream.pipe($.uglify());

      return stream.pipe(gulp.dest(output));
    };
  }
}

export default JsMin;
