class Version extends Task {
  constructor() {
    super('version');
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

      return gulp.src(config.target.base + '/**/*')
        .pipe(revAll.revision())
        .pipe(gulp.dest(config.cacheDir))
        .pipe($.revDeleteOriginal())
        .pipe(revAll.manifestFile())
        .pipe(gulp.dest(config.cacheDir));
    };
  }
}

export default Version;
