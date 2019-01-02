class Style extends BalmTask {
  constructor() {
    super('styles');

    this.input = `${config.target.css}/**/*.css`;
    this.output = config.target.css;
  }

  getAssetsPath(type) {
    let developmentPath = new RegExp(
      `\\.{2}/${config.paths.source[type]}/`,
      'g'
    );
    let productionPath = `../${config.paths.target[type]}/`;

    return $.replace(developmentPath, productionPath);
  }

  get deps() {
    return [this.getStyleTask()];
  }

  get fn() {
    // Production only
    return () => {
      return src(this.input)
        .pipe(this.getAssetsPath('img'))
        .pipe(this.getAssetsPath('font'))
        .pipe(dest(this.output));
    };
  }
}

export default Style;
