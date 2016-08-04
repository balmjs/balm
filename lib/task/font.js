/**
 * 2. Icon Font
 */
class Font extends Task {
  constructor() {
    super('fonts');
  }
  get fn() {
    return () => {
      return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', { paths: config.workspace }, err => {}).concat(config.source.font + '/**/*'))
        .pipe(gulp.dest(this.dist));
    };
  }
}

export default Font;
