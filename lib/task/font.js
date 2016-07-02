/**
 * Icon Font
 */
class Font {
  constructor() {
    this.dist = !config.production ? config.tmp.font : config.target.font;
  }
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
        .pipe(gulp.dest(this.dist));
    }
  }
}

export default Font;
