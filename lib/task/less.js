class Less {
  get name() {
    return 'less';
  }
  get deps() {
    return ['sprites'];
  }
  get fn() {
    return () => {
      return gulp.src(config.app.css + '/**/*.less')
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.less())
        .pipe($.autoprefixer({
          browsers: config.styles.AUTOPREFIXER
        }))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(config.tmp.css))
        .pipe(reload({
          stream: true
        }));
    };
  }
}

export default Less;
