class Version extends BalmJS.Task {
  constructor() {
    super('version');

    this.src = [
      `${config.target.css}/**/*`,
      ...(Object.keys(config.scripts.entry).map(entryKey => {
        let isVendor = config.scripts.vendors.indexOf(entryKey) > -1;
        return isVendor
          ? path.join(config.target.js, config.scripts.vendorName, `${entryKey}.js`)
          : path.join(config.target.js, `${entryKey}.js`);
      })),
      (config.scripts.vendor & !config.scripts.vendors.length)
        ? path.join(config.target.js, `${config.scripts.vendorName}.js`)
        : '',
      `${config.target.img}/**/*`,
      `${config.target.font}/**/*`
    ];

    if (config.static) {
      this.src.push(`${config.target.html}/*.html`);
    }

    this.dist = config.static
      ? config.target.base
      : config.target.static;
  }
  getOptions() {
    return {
      fileNameManifest: config.assets.manifest,
      dontRenameFile: [
        '.html', '.php'
      ],
      dontUpdateReference: ['.html', '.php']
    };
  }
  get deps() {
    return ['build'];
  }
  get fn() {
    return () => {
      return gulp.src(this.src)
        .pipe($.revAll.revision(this.getOptions()))
        .pipe(gulp.dest(this.dist))
        .pipe($.revDeleteOriginal())
        .pipe($.revAll.manifestFile())
        .pipe(gulp.dest(this.dist));
    };
  }
}

export default Version;
