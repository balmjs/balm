class Zip extends Task {
  constructor(input = '', output = '') {
    super('zip');

    this.input =
      input || path.join(config.roots.target, config.paths.target.base, '**/*');
    this.output = output || '.';
  }

  get fn() {
    return () => {
      return gulp
        .src(File.absPaths(this.input))
        .pipe($.zip(config.zip))
        .pipe(gulp.dest(File.absPaths(this.output)));
    };
  }
}

export default Zip;
