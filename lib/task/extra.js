class Extra {
  get name() {
    return 'extras';
  }
  get deps() {
    return [];
  }
  get fn() {
    return () => {
      return gulp.src([
        config.source.base + '/*.*',
        '!' + config.source.html + '/*.html'
      ], {
        dot: true
      }).pipe(gulp.dest(config.target.base));
    };
  }
}

export default Extra;
