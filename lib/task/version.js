class Version extends Task {
  constructor() {
    super('version');
  }
  get deps() {
    return ['build'];
  }
  get fn() {
    return () => {
      const RevAll = $.revAll;
      let revAll = new RevAll({
        fileNameManifest: config.assets.manifest,
        dontRenameFile: ['.html', '.php'],
        dontUpdateReference: ['.html', '.php']
      });

      return gulp.src(this.src)
        .pipe(revAll.revision())
        .pipe($.if('*.html', $.replace(new RegExp(config.paths.target.css + '/', 'g'), this.publicCssPath)))
        .pipe($.if('*.html', $.replace(new RegExp(config.paths.target.js + '/', 'g'), this.publicJsPath)))
        .pipe($.if('*.html', $.replace(new RegExp(config.paths.target.img + '/', 'g'), this.publicImgPath)))
        .pipe($.if('*.html', gulp.dest(config.assets.html), gulp.dest(config.assets.base)))
        .pipe(revAll.manifestFile())
        .pipe(gulp.dest(config.assets.root));
    };
  }
}

export default Version;
