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
        return gulp.src(config.tmp.js + '/**/*.js').pipe(gulp.dest(config.target.js));
      } else {
        return gulp.src(config.source.js + '/**/*').pipe(reload({
          stream: true
        }));
      }
    };
  }
}

export default Script;
