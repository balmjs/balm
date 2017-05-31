class Cache extends BalmJS.Task {
  constructor() {
    super('cache');

    let excludes = this.getAbsPaths(config.assets.excludes).map(filename => {
      return `!${filename}`;
    });

    this.src = [
      `${config.target.css}/**/*`,
      `${config.target.js}/**/*`,
      `${config.target.img}/**/*`,
      `${config.target.font}/**/*`,
      ...excludes,
    ];

    if (config.static) {
      this.src.push(`${config.target.html}/*.html`);
    }

    this.dist = config.static
      ? config.target.base
      : config.target.static;
  }
  get deps() {
    return ['build'];
  }
  get fn() {
    return () => {
      return gulp.src(this.src)
        .pipe($.revAll.revision(config.assets.options))
        .pipe(gulp.dest(this.dist))
        .pipe($.revDeleteOriginal())
        .pipe($.revAll.manifestFile())
        .pipe(gulp.dest(this.dist));
    };
  }
}

export default Cache;
