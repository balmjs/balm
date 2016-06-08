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
      return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', err => {})
          .concat(config.source.font + '/**/*'))
        .pipe(gulp.dest(config.tmp.font))
        .pipe(gulp.dest(config.target.font));
    }
  }
}

export default Font;
