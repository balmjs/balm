class Zip extends BalmJS.Task {
  constructor() {
    super('zip');

    this.input = path.join(config.roots.target, config.paths.target.base, '**/*');
    this.output = '.';
  }
  get recipe() {
    return true;
  }
  get fn() {
    return (input = this.input, output = this.output) => {
      return gulp.src(this.getAbsPaths(input))
        .pipe($.zip(config.zip))
        .pipe(gulp.dest(this.getAbsPaths(output)));
    };
  }
}

export default Zip;
