class Media extends Task {
  constructor() {
    super('media');
  }
  get fn() {
    return () => {
      return config.production
        ? gulp.src(`${config.source.media}/**/*`).pipe(gulp.dest(config.target.media))
        : BalmJS.noop;
    };
  }
}

export default Media;
