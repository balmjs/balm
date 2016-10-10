class Extra extends BalmJS.Task {
  constructor() {
    super('extras');
  }
  get fn() {
    return () => {
      return gulp.src([
        config.source.base + '/*.*',
        '!' + config.source.html + '/*.html',
        '!' + config.source.base + '/*.{css,js,json,md}',
        '!' + config.source.base + '/.git*'
      ], {dot: true})
        .pipe(gulp.dest(config.target.base));
    };
  }
}

export default Extra;
