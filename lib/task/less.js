class Less {
  get name() {
    return 'less';
  }
  get deps() {
    return ['sprites'];
  }
  get fn() {
    return () => {
      let task = gulp.src(config.source.css + '/**/*.less')
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.less())
        .pipe($.autoprefixer({
          browsers: config.styles.AUTOPREFIXER
        }))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(config.tmp.css));

      if (!config.static) {
        return task
          .pipe(gulp.dest(config.target.css))
          .pipe(reload({
            stream: true
          }));
      } else {
        return task
          .pipe(reload({
            stream: true
          }));
      }
    };
  }
}

export default Less;
