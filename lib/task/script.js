class Script {
  get name() {
    return 'scripts';
  }
  get deps() {
    return ['webpack'];
  }
  get fn() {
    return () => {
      if (config.production || !config.static) {
        return gulp.src(config.tmp.js + '/**/*.js')
          .pipe(gulp.dest(config.target.js));
      }
    };
  }
}

export default Script;
