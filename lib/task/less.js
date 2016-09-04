class Less extends BalmJS.Task {
  constructor() {
    super('less');

    this.input = path.join(config.roots.source, config.paths.source.css, '**', '!(_*).less');
  }
  get deps() {
    return this.getSpriteTasks();
  }
  get fn() {
    return (input = this.input, output = config.tmp.css) => {
      return gulp.src(this.getAbsPaths(input))
        // https://github.com/floatdrop/gulp-plumber/issues/30
        .pipe($.plumber(function(error) { // use ES5 for `this`
          $.util.log('Less:', error.message);
          // Must emit end event for any dependent streams to pick up on this. Destroying the stream
          // ensures nothing else in that stream gets done, for example, if we're dealing with five
          // files, after an error in one of them, any other won't carry on. Doing destroy without
          // ending it first will not notify depending streams, tasks like `watch` will hang up.
          this.emit('end');
          this.destroy();
        }))
        .pipe($.sourcemaps.init())
        .pipe($.less({
          paths: path.join(config.workspace, '.')
        }))
        .pipe($.autoprefixer({
          browsers: config.styles.autoprefixer
        }))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(output))
        .pipe(reload({
          stream: true
        }));
    };
  }
}

export default Less;
