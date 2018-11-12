class Media extends BalmTask {
  constructor() {
    super('media');

    this.input = `${config.source.media}/**/*`;
    this.output = config.target.media;
  }

  get fn() {
    return config.production
      ? () => {
          return src(this.input).pipe(dest(this.output));
        }
      : BalmJS.callback;
  }
}

export default Media;
