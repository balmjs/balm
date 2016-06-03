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
        config.app.base + '/*.*',
        '!' + config.app.html + '/*.html'
      ], {
        dot: true
      }).pipe(gulp.dest(config.dist.base));
    };
  }
}

export default Extra;
