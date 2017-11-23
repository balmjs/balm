class Script extends Task {
  constructor() {
    super('scripts');
  }
  get deps() {
    return ['webpack'];
  }
  get fn() {
    return config.production
      ? BalmJS.noop
      : () => {
        return gulp.src(`${config.tmp.js}/**/*`)
          .pipe(browserSync.stream());
      };
  }
}

export default Script;
