class Version extends Task {
  constructor(input = '', output = '', options = {}) {
    super('version');

    this.input = input;
    this.output = output;
    this.options = options;
  }

  get fn() {
    return () => {
      return gulp
        .src(File.absPaths(this.input))
        .pipe(
          $.revAll.revision(Object.assign(config.assets.options, this.options))
        )
        .pipe(gulp.dest(File.absPaths(this.output)))
        .pipe($.revAll.manifestFile())
        .pipe(gulp.dest(File.absPaths(this.output)));
    };
  }
}

export default Version;
