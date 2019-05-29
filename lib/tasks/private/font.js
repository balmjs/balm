class FontTask extends BalmTask {
  constructor() {
    super('fonts');

    this.input = `${config.source.font}/**/*.{eot,svg,ttf,woff,woff2}`;
  }

  get fn() {
    return () => {
      return src(this.input).pipe(
        $.if(
          config.isProd,
          dest(config.target.font),
          dest(
            config.static
              ? config.tmp.font
              : path.join(config.target.static, config.paths.tmp.font)
          )
        )
      );
    };
  }
}

export default FontTask;
