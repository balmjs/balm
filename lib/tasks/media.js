class Media extends BalmJS.Task {
  constructor() {
    super('media');
  }
  get fn() {
    return () => {
      if (config.production) {
        return gulp.src(`${config.source.media}/**/*`)
          .pipe(gulp.dest(config.target.media));
      }
    };
  }
}

export default Media;
