class Version {
  get name() {
    return 'version';
  }
  get deps() {
    return ['lint', 'styles', 'scripts', 'images', 'fonts'];
  }
  get fn() {
    return () => {
      if (config.cache) {
        gulp.src([
            config.target.img + '/**/*',
            config.target.font + '/**/*'
          ], {
            base: config.target.base
          })
          .pipe(gulp.dest(config.cacheDir));

        return gulp.src([
            config.target.css + '/**/*.css',
            config.target.js + '/**/*.js'
          ], {
            base: config.target.base
          })
          .pipe($.plumber())
          // .pipe(gulp.dest(config.roots.cache)) // copy original assets to build dir
          .pipe($.rev())
          .pipe(gulp.dest(config.cacheDir)) // write rev'd assets to build dir
          .pipe($.rev.manifest(config.cacheDir + '/' + config.manifest, {
            base: config.cacheDir,
            merge: true
          }))
          .pipe(gulp.dest(config.cacheDir)); // write manifest to build dir
      }
    };
  }
}

export default Version;
