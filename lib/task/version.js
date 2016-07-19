class Version extends Task {
  constructor() {
    super('version');

    this.src = [
      config.target.css + '/**/*',
      ...(Object.keys(config.scripts.entry).map(entryKey => {
        let isVendor = config.scripts.vendors.indexOf(entryKey) > -1;
        return isVendor ?
          path.join(config.target.js, 'vendor', entryKey + '.js') :
          path.join(config.target.js, entryKey + '.js');
      })),
      config.target.img + '/**/*',
      config.target.font + '/**/*'
    ];

    if (config.static) {
      this.src.push(config.target.html + '/**/*.html');
    }
  }
  get deps() {
    return ['build'];
  }
  get fn() {
    return () => {
      let revAll = new $.revAll({
        fileNameManifest: config.manifest,
        dontRenameFile: ['.html', '.php'],
        dontUpdateReference: ['.html', '.php']
      });

      return gulp.src(this.src)
        .pipe(revAll.revision())
        .pipe(gulp.dest(config.cacheDir))
        .pipe($.revDeleteOriginal())
        .pipe(revAll.manifestFile())
        .pipe(gulp.dest(config.cacheDir));
    };
  }
}

export default Version;
