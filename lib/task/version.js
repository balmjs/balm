class Version extends Task {
  constructor() {
    super('version');

    this.src = [
      config.target.css + '/**/*',
      config.target.js + '/**/*',
      config.target.img + '/**/*',
      config.target.font + '/**/*'
    ];

    if (config.static) {
      this.src.push(config.target.html + '/**/*');
    }
  }
  get deps() {
    return ['build'];
  }
  get fn() {
    return () => {
      let revAll = new $.revAll({
        fileNameManifest: config.manifest,
        dontRenameFile: ['.html', '.php']
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
