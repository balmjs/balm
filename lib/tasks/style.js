class Style extends Task {
  constructor() {
    super('styles');
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
    return config.production
      ? () => {
          return gulp
            .src(`${config.target.css}/**/*.css`)
            .pipe(this.getAssetsPath('img'))
            .pipe(this.getAssetsPath('font'))
            .pipe(gulp.dest(config.target.css));
        }
      : BalmJS.noop;
  }
}

export default Style;
