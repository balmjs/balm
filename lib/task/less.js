class Less extends Task {
  constructor() {
    super('less');
  }
  get deps() {
    return this.getSpriteTasks();
  }
  get fn() {
    return (input = this.input, output = this.output) => {
      return gulp.src(this.getAbsPaths(input))
        .pipe($.sourcemaps.init())
        .pipe($.less({
          paths: path.join(config.workspace, '.')
        }))
        // for less Error Handling
        .on('error', $.notify.onError({
          message: error => {
            $.util.log(error.message);
          }
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
