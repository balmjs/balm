class Cache extends BalmJS.Task {
  constructor() {
    super('cache');

    let includes = this.getAbsPaths(config.assets.includes).map(filename => {
      return filename;
    });

    let excludes = this.getAbsPaths(config.assets.excludes).map(filename => {
      return `!${filename}`;
    });

    this.src = [
      `${config.target.css}/**/*`,
      `${config.target.img}/**/*`,
      `${config.target.font}/**/*`,
      // Exclude splitting code
      ...(Object.keys(config.scripts.entry).map(entryKey => {
        let isVendor = config.scripts.vendors.includes(entryKey);
        return isVendor
          ? path.join(config.target.js, 'vendor', `${entryKey}.js`)
          : path.join(config.target.js, `${entryKey}.js`);
      })),
      // For vendors all in one file
      path.join(config.target.js, `${config.scripts.vendorName}.js`),
      // For other vendors
      ...includes,
      ...excludes
    ];

    if (config.static) {
      this.src.push(`${config.target.base}/*.html`);
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
        .pipe($.if('*.html', this.getPublicPath()))
        .pipe(gulp.dest(this.dist))
        .pipe($.revDeleteOriginal())
        .pipe($.revAll.manifestFile())
        .pipe(gulp.dest(this.dist));
    };
  }
}

export default Cache;
