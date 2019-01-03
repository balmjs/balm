class JsMin extends BalmTask {
  constructor(
    input = '',
    output = '',
    uglifyOptions = {},
    renameOptions = { suffix: '.min' }
  ) {
    super('jsmin');

    this.input = input;
    this.output = output;
    this.uglifyOptions = uglifyOptions;
    this.renameOptions = renameOptions;
  }

  get fn() {
    return () => {
      let stream = src(BalmFile.absPaths(this.input)).pipe($.plumber());

      stream = Object.keys(this.uglifyOptions).length
        ? stream.pipe($.uglify(this.uglifyOptions))
        : stream.pipe($.uglify());

      return stream
        .pipe($.rename(this.renameOptions))
        .pipe(dest(BalmFile.absPaths(this.output)));
    };
  }
}

export default JsMin;
