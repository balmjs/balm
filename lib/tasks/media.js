class Media extends BalmTask {
  constructor() {
    super('media');

    this.input = `${config.source.media}/**/*`;
    this.output = config.target.media;
  }

  get fn() {
    return () => {
      return config.production
        ? src(this.input).pipe(dest(this.output))
        : BalmJS.noop;
    };
  }
}

export default Media;
