/**
 * 2. Icon Font
 */
class Font extends BalmJS.Task {
  constructor() {
    super('fonts');
  }
  get fn() {
    return () => {
      return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', {
        paths: config.workspace
      }, err => {
        logger.warning('[Font]', err); // Continue
      }).concat(`${config.source.font}/**/*`))
        .pipe($.if(config.production, gulp.dest(config.target.font), gulp.dest(config.tmp.font)));
    };
  }
}

export default Font;
