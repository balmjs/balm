class Zip extends BalmJS.Task {
  constructor() {
    super('zip');
  }
  get fn() {
    return (
      input = path.join(config.roots.target, config.paths.target.base, '**/*'),
      output = config.workspace
    ) => {
      return gulp.src(this.getAbsPaths(input))
        .pipe($.zip(config.zip))
        .pipe(gulp.dest(output));
    };
  }
}

export default Zip;
