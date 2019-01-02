class Image extends BalmTask {
  constructor() {
    super('images');

    this.input = [`${config.source.img}/**/*`];
    for (let imageFolder of config.sprites.image) {
      this.input.push(`!${config.source.img}/${imageFolder}`);
      this.input.push(`!${config.source.img}/${imageFolder}/*.png`);
    }
  }

  get fn() {
    return () => {
      return src(this.input)
        .pipe($.cache($.imagemin()))
        .pipe(dest(this.getImageDist()));
    };
  }
}

export default Image;
