class MediaTask extends BalmTask {
  constructor() {
    super('media');

    this.input = `${config.source.media}/**/*`;
    this.output =
      config.isProd || !config.static ? config.target.media : config.tmp.media;
  }

  get fn() {
    return () => {
      return src(this.input).pipe(dest(this.output));
    };
  }
}

export default MediaTask;
