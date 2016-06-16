class Version {
  get name() {
    return 'version';
  }
  get deps() {
    return ['styles', 'scripts'];
  }
  get fn() {
    return () => {
      return gulp.src([
          config.target.css + '/**/*.css',
          config.target.js + '/**/*.js'
        ], {
          base: config.target.base
        })
        .pipe(gulp.dest(config.target.base)) // copy original assets to build dir
        .pipe($.rev())
        .pipe(gulp.dest(config.target.base)) // write rev'd assets to build dir
        .pipe($.rev.manifest(config.target.base + '/' + config.manifest, {
          base: config.target.base,
          merge: true
        }))
        .pipe(gulp.dest(config.target.base)); // write manifest to build dir
    };
  }
}

export default Version;
