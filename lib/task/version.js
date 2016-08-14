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
      this.src.push(config.target.html + '/*.html');
    }
  }
  get deps() {
    return ['build'];
  }
  get fn() {
    return () => {
      const RevAll = $.revAll;
      let revAll = new RevAll({
        fileNameManifest: config.assets.manifest,
        dontRenameFile: [
          '.html',
          '.php'
          // config.scripts.asyncSuffix + '.js',
          // config.scripts.asyncSuffix + '.js.map'
        ],
        dontUpdateReference: ['.html', '.php']
      });

      return gulp.src(this.src)
        .pipe(revAll.revision())
        .pipe(gulp.dest(config.target.base))
        .pipe($.revDeleteOriginal())
        .pipe(revAll.manifestFile())
        .pipe(gulp.dest(config.target.base));
    };
  }
}

export default Version;
