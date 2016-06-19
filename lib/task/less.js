class Less {
  get name() {
    return 'less';
  }
  get deps() {
    return ['sprites'];
  }
  get fn() {
    return (input = config.source.css + '/**/*.less', output = config.tmp.css) => {
      return gulp.src(input)
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.less())
        .pipe($.autoprefixer({
          browsers: config.styles.autoprefixer
        }))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(output));
    };
  }
}

export default Less;
