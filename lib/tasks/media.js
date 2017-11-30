class Media extends Task {
  constructor() {
    super('media');
  }

  get fn() {
    return () => {
      return config.production
        ? gulp
            .src(`${config.source.media}/**/*`)
            .pipe(
              $.if(
                config.production,
                gulp.dest(config.target.media),
                gulp.dest(config.tmp.media)
              )
            )
        : BalmJS.noop;
    };
  }
}

export default Media;
