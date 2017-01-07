class Less extends BalmJS.Task {
  constructor() {
    super('less');

    this.input = path.join(config.roots.source, config.paths.source.css, '**', '!(_*).less');
    this.output = path.join(config.roots.tmp, config.paths.tmp.css);
  }
  errorHandler(error) { // https://github.com/floatdrop/gulp-plumber/issues/30
    logger.warning('[Less]', error.message, true);
    // Must emit end event for any dependent streams to pick up on this. Destroying the stream
    // ensures nothing else in that stream gets done, for example, if we're dealing with five
    // files, after an error in one of them, any other won't carry on. Doing destroy without
    // ending it first will not notify depending streams, tasks like `watch` will hang up.
    this.emit('end');
    this.destroy();
  }
  getOptions() {
    return {
      paths: path.join(config.workspace, '.')
    };
  }
  get recipe() {
    return true;
  }
  get deps() {
    return this.getSpriteTasks();
  }
  get fn() {
    return (input = this.input, output = this.output) => {
      return gulp.src(this.getAbsPaths(input))
        .pipe($.plumber(this.errorHandler))
        .pipe($.sourcemaps.init())
        .pipe($.less(this.getOptions()))
        .pipe($.autoprefixer({browsers: config.styles.autoprefixer}))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(this.getAbsPaths(output)))
        .pipe(browserSync.stream({match: '**/*.css'}));
    };
  }
}

export default Less;
