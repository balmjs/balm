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
          // .pipe(gulp.dest(config.roots.build)) // copy original assets to build dir
          .pipe($.rev())
          .pipe(gulp.dest(config.buildDirectory)) // write rev'd assets to build dir
          .pipe($.rev.manifest(config.buildDirectory + '/' + config.manifest, {
            base: config.buildDirectory,
            merge: true
          }))
          .pipe(gulp.dest(config.buildDirectory)); // write manifest to build dir
      };
    }
  }
}

export default Version;
