/**
 * Icon Font
 */
class Font {
  get name() {
    return 'fonts';
  }
  get deps() {
    return [];
  }
  get fn() {
    return () => {
      let task = gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', err => {})
          .concat(config.source.font + '/**/*'))
        .pipe(gulp.dest(config.tmp.font));

      if (config.cache) {
        return task.pipe(gulp.dest(config.buildDirectory + '/' + config.paths.target.font));
      } else {
        return task.pipe(gulp.dest(config.target.font));
      }
    }
  }
}

export default Font;
