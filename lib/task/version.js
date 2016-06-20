class Version {
  get name() {
    return 'version';
  }
  get deps() {
    return ['styles', 'scripts'];
  }
  get fn() {
    if (config.cache) {
      return () => {
        return gulp.src([
            config.target.css + '/**/*.css',
            config.target.js + '/**/*.js'
          ], {
            base: config.target.base
          })
          // .pipe(gulp.dest(config.roots.cache)) // copy original assets to build dir
          .pipe($.rev())
          .pipe(gulp.dest(config.cacheDir)) // write rev'd assets to build dir
          .pipe($.rev.manifest(config.cacheDir + '/' + config.manifest, {
            base: config.cacheDir,
            merge: true
          }))
          .pipe(gulp.dest(config.cacheDir)); // write manifest to build dir
      };
    }
  }
}

export default Version;
