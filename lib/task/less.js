class Less {
  get name() {
    return 'less';
  }
  get deps() {
    return ['sprites'];
  }
  get fn() {
    return () => {
      return gulp.src(config.source.css + '/**/*.less')
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.less())
        .pipe($.autoprefixer({
          browsers: config.styles.autoprefixer
        }))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(config.tmp.css));
    };
  }
}

export default Less;
